import bcrypt from "bcryptjs";
import * as userRepo from "../repositories/user.repository";
import * as inviteRepo from "../repositories/admin-invitation.repository";
import { ApplicationError } from "../errors";
import { signActivationToken, signAccessToken, signRefreshToken, verifyAccessToken } from "../lib/jwt";
import { validatePassword } from "../lib/validation";

export async function activate(
  email: string,
  temporaryPassword: string
): Promise<{ activation_token: string; requires_profile_setup: boolean }> {
  const invitation = await inviteRepo.findByEmail(email);
  if (!invitation) {
    throw new ApplicationError(404, "No invitation found for this email", "NOT_FOUND");
  }

  if (invitation.status !== "pending") {
    throw new ApplicationError(400, "Invitation already used or expired", "INVITATION_INVALID");
  }

  if (new Date(invitation.expires_at) < new Date()) {
    await inviteRepo.updateStatus(invitation.id, 'expired');
    throw new ApplicationError(400, "Invitation has expired", "INVITATION_EXPIRED");
  }

  const isMatch = await bcrypt.compare(temporaryPassword, invitation.temp_password_hash);
  if (!isMatch) {
    throw new ApplicationError(401, "Invalid temporary password", "AUTH_FAILED");
  }

  const existingUser = await userRepo.findByEmail(email);

  let userId: string;

  if (existingUser) {
    userId = existingUser.id;
    await userRepo.updateById(userId, { role: 'admin', admin_role_id: invitation.role_id });
  } else {
    const tempHash = await bcrypt.hash(temporaryPassword, 10);
    const created = await userRepo.create({
      first_name: 'Pending',
      email,
      password_hash: tempHash,
      role: 'admin',
      admin_role_id: invitation.role_id,
      status: 'inactive',
    });
    userId = created.id;
  }

  const activationToken = signActivationToken(userId, email);
  return { activation_token: activationToken, requires_profile_setup: true };
}

export async function setupProfile(
  activationToken: string,
  firstName: string,
  lastName: string,
  phone: string,
  password: string,
  confirmPassword: string
): Promise<{ id: string; token: string; refresh_token: string }> {
  if (password !== confirmPassword) {
    throw new ApplicationError(400, "Passwords do not match", "VALIDATION_ERROR");
  }

  validatePassword(password);

  let decoded: { id: string; email: string; purpose?: string };
  try {
    decoded = verifyAccessToken<{ id: string; email: string; purpose?: string }>(activationToken);
  } catch {
    throw new ApplicationError(401, "Invalid or expired activation token", "AUTH_INVALID");
  }

  if (decoded.purpose !== "activation") {
    throw new ApplicationError(401, "Invalid token type", "AUTH_INVALID");
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userRepo.activateProfile(decoded.id, {
    first_name: firstName,
    last_name: lastName,
    phone,
    password_hash: hash,
  });

  if (!user) {
    throw new ApplicationError(404, "User not found", "NOT_FOUND");
  }

  await inviteRepo.markActivated(decoded.email);

  const token = signAccessToken({ id: user.id, email: user.email, role: user.role });
  const refreshToken = signRefreshToken(user.id);

  return { id: user.id, token, refresh_token: refreshToken };
}
