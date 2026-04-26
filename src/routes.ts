/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SupportController } from './controllers/SupportController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { QuotesController } from './controllers/QuotesController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ProfileController } from './controllers/ProfileController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PaymentMethodController } from './controllers/PaymentMethodController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { NotificationController } from './controllers/NotificationController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ContactController } from './controllers/LeadsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ServiceRequestsController } from './controllers/LeadsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CleanerApplicationsController } from './controllers/LeadsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ServicesController } from './controllers/ContentController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BlogController } from './controllers/ContentController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { FaqsController } from './controllers/ContentController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CostGuidesController } from './controllers/ContentController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LocationsController } from './controllers/ContentController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CleanerSecurityController } from './controllers/CleanerSecurityController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CleanerProfileController } from './controllers/CleanerProfileController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CleanerPaymentMethodController } from './controllers/CleanerPaymentMethodController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CleanerEarningsController } from './controllers/CleanerEarningsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CleanerWithdrawalsController } from './controllers/CleanerEarningsController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CleanerBookingController } from './controllers/CleanerBookingController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CleanerAvailabilityController } from './controllers/CleanerAvailabilityController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { BookingController } from './controllers/BookingController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './controllers/AuthController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminUserController } from './controllers/AdminUserController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminTransactionController } from './controllers/AdminTransactionController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminSupportController } from './controllers/AdminSupportController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminServiceController } from './controllers/AdminServiceController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminRoleController } from './controllers/AdminRoleController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminProfileController } from './controllers/AdminProfileController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminDashboardController } from './controllers/AdminDashboardController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminCustomerController } from './controllers/AdminCustomerController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminCostGuideController } from './controllers/AdminCostGuideController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminCleanerController } from './controllers/AdminCleanerController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminBookingController } from './controllers/AdminBookingController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminActivityLogController } from './controllers/AdminActivityLogController';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AddressController } from './controllers/AddressController';
import { expressAuthentication } from './auth';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';

const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "CreateTicketRequest": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TicketListItem": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
            "created_at": {"dataType":"string","required":true},
            "last_message_at": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaginationMeta": {
        "dataType": "refObject",
        "properties": {
            "total": {"dataType":"double","required":true},
            "page": {"dataType":"double","required":true},
            "limit": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ListResponse_TicketListItem_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"TicketListItem"},"required":true},
            "meta": {"ref":"PaginationMeta","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "TicketDetail": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
            "created_at": {"dataType":"string","required":true},
            "messages": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"created_at":{"dataType":"string","required":true},"body":{"dataType":"string","required":true},"sender":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}}},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ErrorResponse": {
        "dataType": "refObject",
        "properties": {
            "error": {"dataType":"nestedObjectLiteral","nestedProperties":{"details":{"dataType":"any"},"message":{"dataType":"string","required":true},"code":{"dataType":"string","required":true}},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AddOnSlug": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["oven"]},{"dataType":"enum","enums":["fridge"]},{"dataType":"enum","enums":["windows"]},{"dataType":"enum","enums":["chairs"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AddOn": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "slug": {"ref":"AddOnSlug","required":true},
            "hours_added": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FrequencyOption": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["one-off"]},{"dataType":"enum","enums":["2-3-times-a-week"]},{"dataType":"enum","enums":["every-week"]},{"dataType":"enum","enums":["every-2-weeks"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PricingConfig": {
        "dataType": "refObject",
        "properties": {
            "hourly_rate": {"dataType":"double","required":true},
            "cleaning_products_fee": {"dataType":"double","required":true},
            "service_fee": {"dataType":"double","required":true},
            "weekend_surcharge": {"dataType":"double","required":true},
            "currency": {"dataType":"enum","enums":["GBP"],"required":true},
            "add_ons": {"dataType":"array","array":{"dataType":"refObject","ref":"AddOn"},"required":true},
            "frequencies": {"dataType":"array","array":{"dataType":"refAlias","ref":"FrequencyOption"},"required":true},
            "cleaning_products_note": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CleaningProducts": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["bring"]},{"dataType":"enum","enums":["provide"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DayOfWeek": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["monday"]},{"dataType":"enum","enums":["tuesday"]},{"dataType":"enum","enums":["wednesday"]},{"dataType":"enum","enums":["thursday"]},{"dataType":"enum","enums":["friday"]},{"dataType":"enum","enums":["saturday"]},{"dataType":"enum","enums":["sunday"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "QuoteLineItem": {
        "dataType": "refObject",
        "properties": {
            "label": {"dataType":"string","required":true},
            "amount": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "QuoteResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "postcode": {"dataType":"string","required":true},
            "rooms": {"dataType":"double","required":true},
            "bathrooms": {"dataType":"double","required":true},
            "add_ons": {"dataType":"array","array":{"dataType":"refAlias","ref":"AddOnSlug"},"required":true},
            "hours": {"dataType":"double","required":true},
            "cleaning_products": {"ref":"CleaningProducts","required":true},
            "frequency": {"ref":"FrequencyOption","required":true},
            "preferred_days": {"dataType":"array","array":{"dataType":"refAlias","ref":"DayOfWeek"},"required":true},
            "line_items": {"dataType":"array","array":{"dataType":"refObject","ref":"QuoteLineItem"},"required":true},
            "total": {"dataType":"double","required":true},
            "currency": {"dataType":"enum","enums":["GBP"],"required":true},
            "recommended_hours": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "QuoteRequest": {
        "dataType": "refObject",
        "properties": {
            "postcode": {"dataType":"string","required":true},
            "rooms": {"dataType":"double","required":true},
            "bathrooms": {"dataType":"double","required":true},
            "add_ons": {"dataType":"array","array":{"dataType":"refAlias","ref":"AddOnSlug"}},
            "hours": {"dataType":"double","required":true},
            "cleaning_products": {"ref":"CleaningProducts","required":true},
            "frequency": {"ref":"FrequencyOption","required":true},
            "preferred_days": {"dataType":"array","array":{"dataType":"refAlias","ref":"DayOfWeek"}},
            "email": {"dataType":"string","required":true},
            "newsletter_opt_in": {"dataType":"boolean"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "QuoteScheduleResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "preferred_date": {"dataType":"string","required":true},
            "preferred_time": {"dataType":"string","required":true},
            "weekend_surcharge": {"dataType":"double","required":true},
            "final_total": {"dataType":"double","required":true},
            "currency": {"dataType":"enum","enums":["GBP"],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "QuoteScheduleRequest": {
        "dataType": "refObject",
        "properties": {
            "preferred_date": {"dataType":"string","required":true},
            "preferred_time": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ProfileResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "first_name": {"dataType":"string","required":true},
            "last_name": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "phone": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "email": {"dataType":"string","required":true},
            "profile_image_url": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "rating": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateProfileRequest": {
        "dataType": "refObject",
        "properties": {
            "first_name": {"dataType":"string"},
            "last_name": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdatePhoneResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
            "verification_method": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdatePhoneRequest": {
        "dataType": "refObject",
        "properties": {
            "phone": {"dataType":"string","required":true},
            "verification_method": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["sms"]},{"dataType":"enum","enums":["email"]}],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaymentMethodResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "last4": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "brand": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreatePaymentMethodRequest": {
        "dataType": "refObject",
        "properties": {
            "type": {"dataType":"enum","enums":["card"],"required":true},
            "card_name": {"dataType":"string","required":true},
            "card_token": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "NotificationResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "body": {"dataType":"string","required":true},
            "read": {"dataType":"boolean","required":true},
            "created_at": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ListResponse_NotificationResponse_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"NotificationResponse"},"required":true},
            "meta": {"ref":"PaginationMeta","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ContactMessageResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "created_at": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ContactMessageRequest": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "source": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["about"]},{"dataType":"enum","enums":["locations"]},{"dataType":"enum","enums":["quote"]},{"dataType":"enum","enums":["cleaning_with_fada"]},{"dataType":"enum","enums":["cleaner_registration"]},{"dataType":"enum","enums":["other"]}]},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ServiceRequestResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "created_at": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ServiceRequestBody": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "phone": {"dataType":"string"},
            "service_description": {"dataType":"string","required":true},
            "preferred_date": {"dataType":"string"},
            "location": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CleanerApplicationResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "created_at": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Gender": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["male"]},{"dataType":"enum","enums":["female"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CleaningExperienceType": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["domestic"]},{"dataType":"enum","enums":["hotel"]},{"dataType":"enum","enums":["end_of_tenancy"]},{"dataType":"enum","enums":["laundry"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CleanerApplicationRequest": {
        "dataType": "refObject",
        "properties": {
            "first_name": {"dataType":"string","required":true},
            "last_name": {"dataType":"string","required":true},
            "country_code": {"dataType":"string"},
            "phone_number": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "gender": {"ref":"Gender","required":true},
            "postcode": {"dataType":"string","required":true},
            "years_of_experience": {"dataType":"string","required":true},
            "experience_types": {"dataType":"array","array":{"dataType":"refAlias","ref":"CleaningExperienceType"},"required":true},
            "experience_description": {"dataType":"string"},
            "hours_per_week": {"dataType":"double","required":true},
            "available_days": {"dataType":"array","array":{"dataType":"refAlias","ref":"DayOfWeek"},"required":true},
            "commitment_duration": {"dataType":"string","required":true},
            "right_to_work_uk": {"dataType":"enum","enums":[true],"required":true},
            "has_uk_bank_account": {"dataType":"enum","enums":[true],"required":true},
            "understands_self_employed": {"dataType":"enum","enums":[true],"required":true},
            "no_criminal_record": {"dataType":"enum","enums":[true],"required":true},
            "accepts_terms": {"dataType":"enum","enums":[true],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CleanerApplicationDetail": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "first_name": {"dataType":"string","required":true},
            "last_name": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "phone_number": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
            "created_at": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateCleanerApplicationRequest": {
        "dataType": "refObject",
        "properties": {
            "first_name": {"dataType":"string"},
            "last_name": {"dataType":"string"},
            "phone_number": {"dataType":"string"},
            "postcode": {"dataType":"string"},
            "experience_description": {"dataType":"string"},
            "hours_per_week": {"dataType":"double"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Service": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "created_at": {"dataType":"string","required":true},
            "updated_at": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "slug": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "image_url": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "icon_url": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "display_order": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ListResponse_Service_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"Service"},"required":true},
            "meta": {"ref":"PaginationMeta","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BlogCategory": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "slug": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ListResponse_BlogCategory_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"BlogCategory"},"required":true},
            "meta": {"ref":"PaginationMeta","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BlogPost": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "created_at": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "slug": {"dataType":"string","required":true},
            "excerpt": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "content": {"dataType":"string","required":true},
            "cover_image_url": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "author": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "published_at": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "category_name": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "category_slug": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ListResponse_BlogPost_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"BlogPost"},"required":true},
            "meta": {"ref":"PaginationMeta","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Faq": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "question": {"dataType":"string","required":true},
            "answer": {"dataType":"string","required":true},
            "display_order": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ListResponse_Faq_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"Faq"},"required":true},
            "meta": {"ref":"PaginationMeta","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CostGuide": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "slug": {"dataType":"string","required":true},
            "excerpt": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "published_at": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ListResponse_CostGuide_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"CostGuide"},"required":true},
            "meta": {"ref":"PaginationMeta","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CostGuidePricingRow": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "service_category": {"dataType":"string","required":true},
            "rate": {"dataType":"string","required":true},
            "explanation": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "display_order": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CostGuideDetail": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "slug": {"dataType":"string","required":true},
            "excerpt": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "published_at": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "content": {"dataType":"string","required":true},
            "pricing_table": {"dataType":"array","array":{"dataType":"refObject","ref":"CostGuidePricingRow"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Location": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "region": {"dataType":"string","required":true},
            "country": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ListResponse_Location_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"Location"},"required":true},
            "meta": {"ref":"PaginationMeta","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ChangePinResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ChangePinRequest": {
        "dataType": "refObject",
        "properties": {
            "old_pin": {"dataType":"string","required":true},
            "new_pin": {"dataType":"string","required":true},
            "confirm_pin": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CleanerHomeAddress": {
        "dataType": "refObject",
        "properties": {
            "street": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "country": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "postcode": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "floor_number": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "door_number": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "entrance_notes": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CleanerProfileResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "first_name": {"dataType":"string","required":true},
            "last_name": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "phone": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "email": {"dataType":"string","required":true},
            "profile_image_url": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "rating": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "completed_bookings": {"dataType":"double","required":true},
            "location": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "address": {"dataType":"union","subSchemas":[{"ref":"CleanerHomeAddress"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateCleanerProfileRequest": {
        "dataType": "refObject",
        "properties": {
            "first_name": {"dataType":"string"},
            "last_name": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateCleanerPhoneResponse": {
        "dataType": "refAlias",
        "type": {"ref":"UpdatePhoneResponse","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateCleanerPhoneRequest": {
        "dataType": "refAlias",
        "type": {"ref":"UpdatePhoneRequest","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateCleanerAddressResponse": {
        "dataType": "refObject",
        "properties": {
            "street": {"dataType":"string","required":true},
            "country": {"dataType":"string","required":true},
            "postcode": {"dataType":"string","required":true},
            "floor_number": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "door_number": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "entrance_notes": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateCleanerAddressRequest": {
        "dataType": "refObject",
        "properties": {
            "address": {"dataType":"string","required":true},
            "country": {"dataType":"string","required":true},
            "postcode": {"dataType":"string","required":true},
            "floor_number": {"dataType":"string"},
            "door_number": {"dataType":"string"},
            "entrance_notes": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CleanerPaymentMethodResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "account_number": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "bank_name": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateCleanerPaymentMethodRequest": {
        "dataType": "refObject",
        "properties": {
            "account_number": {"dataType":"string","required":true},
            "account_holder": {"dataType":"string","required":true},
            "bank_name": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EarningsSummary": {
        "dataType": "refObject",
        "properties": {
            "total_earnings": {"dataType":"string","required":true},
            "total_withdrawals": {"dataType":"string","required":true},
            "bookings_completed": {"dataType":"double","required":true},
            "period": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IncomeLine": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "service": {"dataType":"string","required":true},
            "customer": {"dataType":"string","required":true},
            "date": {"dataType":"string","required":true},
            "time": {"dataType":"string","required":true},
            "address": {"dataType":"string","required":true},
            "amount": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WithdrawalLine": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "amount": {"dataType":"string","required":true},
            "date": {"dataType":"string","required":true},
            "time": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
            "bank_account": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "bank_name": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "WithdrawalResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "amount": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
            "bank_account": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "bank_name": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateWithdrawalRequest": {
        "dataType": "refObject",
        "properties": {
            "amount": {"dataType":"double","required":true},
            "pin": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CleanerBookingListItem": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "service_type": {"dataType":"string","required":true},
            "date": {"dataType":"string","required":true},
            "time": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
            "customer": {"dataType":"union","subSchemas":[{"dataType":"nestedObjectLiteral","nestedProperties":{"rating":{"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},"name":{"dataType":"string","required":true}}},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CleanerBookingDetail": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "service_type": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
            "date": {"dataType":"string","required":true},
            "time": {"dataType":"string","required":true},
            "additional_info": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "customer": {"dataType":"union","subSchemas":[{"dataType":"nestedObjectLiteral","nestedProperties":{"completed_bookings":{"dataType":"double","required":true},"rating":{"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},"name":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}}},{"dataType":"enum","enums":[null]}],"required":true},
            "address": {"dataType":"union","subSchemas":[{"dataType":"nestedObjectLiteral","nestedProperties":{"entrance_notes":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"county":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"door_number":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"floor_number":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"street":{"dataType":"string","required":true},"label":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true}}},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RateBookingRequest": {
        "dataType": "refObject",
        "properties": {
            "rating": {"dataType":"double","required":true},
            "review": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CleanerRateRequest": {
        "dataType": "refAlias",
        "type": {"ref":"RateBookingRequest","validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DaySchedule": {
        "dataType": "refObject",
        "properties": {
            "accept": {"dataType":"boolean","required":true},
            "start": {"dataType":"string"},
            "end": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AvailabilitySchedule": {
        "dataType": "refObject",
        "properties": {
            "monday": {"ref":"DaySchedule","required":true},
            "tuesday": {"ref":"DaySchedule","required":true},
            "wednesday": {"ref":"DaySchedule","required":true},
            "thursday": {"ref":"DaySchedule","required":true},
            "friday": {"ref":"DaySchedule","required":true},
            "saturday": {"ref":"DaySchedule","required":true},
            "sunday": {"ref":"DaySchedule","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AvailabilityResponse": {
        "dataType": "refObject",
        "properties": {
            "mode": {"dataType":"string","required":true},
            "schedule": {"ref":"AvailabilitySchedule","required":true},
            "accept_bookings": {"dataType":"boolean","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AvailabilityMode": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["every_day"]},{"dataType":"enum","enums":["weekdays"]},{"dataType":"enum","enums":["weekends"]},{"dataType":"enum","enums":["custom"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateAvailabilityRequest": {
        "dataType": "refObject",
        "properties": {
            "mode": {"ref":"AvailabilityMode","required":true},
            "schedule": {"ref":"AvailabilitySchedule","required":true},
            "accept_bookings": {"dataType":"boolean"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ServiceType": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["domestic"]},{"dataType":"enum","enums":["commercial"]},{"dataType":"enum","enums":["hotel"]},{"dataType":"enum","enums":["laundry"]},{"dataType":"enum","enums":["end_of_tenancy"]},{"dataType":"enum","enums":["appliance"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PropertyCondition": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["mildly_used"]},{"dataType":"enum","enums":["heavily_used"]},{"dataType":"enum","enums":["new"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PropertyType": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["home"]},{"dataType":"enum","enums":["condo"]},{"dataType":"enum","enums":["office"]},{"dataType":"enum","enums":["hotel"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookingAddOn": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["oven"]},{"dataType":"enum","enums":["dryer"]},{"dataType":"enum","enums":["airfryer"]},{"dataType":"enum","enums":["dishwasher"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateBookingRequest": {
        "dataType": "refObject",
        "properties": {
            "address_id": {"dataType":"string","required":true},
            "service_type": {"ref":"ServiceType","required":true},
            "condition": {"ref":"PropertyCondition","required":true},
            "property_type": {"ref":"PropertyType","required":true},
            "total_sq_metres": {"dataType":"double","required":true},
            "rooms": {"dataType":"double","required":true},
            "floors": {"dataType":"double","required":true},
            "bathrooms": {"dataType":"double","required":true},
            "add_ons": {"dataType":"array","array":{"dataType":"refAlias","ref":"BookingAddOn"}},
            "date": {"dataType":"string","required":true},
            "time": {"dataType":"string","required":true},
            "additional_info": {"dataType":"string"},
            "use_same_cleaner": {"dataType":"boolean"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookingListItem": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "service_type": {"dataType":"string","required":true},
            "date": {"dataType":"string","required":true},
            "time": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
            "cleaner": {"dataType":"union","subSchemas":[{"dataType":"nestedObjectLiteral","nestedProperties":{"rating":{"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},"name":{"dataType":"string","required":true}}},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ListResponse_BookingListItem_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"BookingListItem"},"required":true},
            "meta": {"ref":"PaginationMeta","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookingDetail": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "service_type": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
            "date": {"dataType":"string","required":true},
            "time": {"dataType":"string","required":true},
            "additional_info": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "use_same_cleaner": {"dataType":"boolean","required":true},
            "cleaner": {"dataType":"union","subSchemas":[{"dataType":"nestedObjectLiteral","nestedProperties":{"location":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"completed_bookings":{"dataType":"double","required":true},"rating":{"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},"name":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}}},{"dataType":"enum","enums":[null]}],"required":true},
            "payment": {"dataType":"nestedObjectLiteral","nestedProperties":{"status":{"dataType":"string","required":true},"method":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"total":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"discount":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"charges":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"booking_fee":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true}},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PayBookingResponse": {
        "dataType": "refObject",
        "properties": {
            "transaction_id": {"dataType":"string","required":true},
            "client_secret": {"dataType":"string"},
            "status": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PaymentMethod": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["cash"]},{"dataType":"enum","enums":["card"]},{"dataType":"enum","enums":["apple_pay"]},{"dataType":"enum","enums":["google_pay"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PayBookingRequest": {
        "dataType": "refObject",
        "properties": {
            "method": {"ref":"PaymentMethod","required":true},
            "tip": {"dataType":"double"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AmendBookingRequest": {
        "dataType": "refObject",
        "properties": {
            "floors": {"dataType":"double"},
            "rooms": {"dataType":"double"},
            "bathrooms": {"dataType":"double"},
            "add_ons": {"dataType":"array","array":{"dataType":"refAlias","ref":"BookingAddOn"}},
            "additional_info": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RescheduleBookingRequest": {
        "dataType": "refObject",
        "properties": {
            "date": {"dataType":"string","required":true},
            "time": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "BookingImageResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "url": {"dataType":"string","required":true},
            "uploaded_at": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReceiptResponse": {
        "dataType": "refObject",
        "properties": {
            "booking_fee": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "charges": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "discount": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "total": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "payment_method": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "payment_status": {"dataType":"string","required":true},
            "service": {"dataType":"string","required":true},
            "additional_info": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AuthResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "first_name": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "token": {"dataType":"string","required":true},
            "refresh_token": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RegisterRequest": {
        "dataType": "refObject",
        "properties": {
            "first_name": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
            "service_type": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "first_name": {"dataType":"string","required":true},
            "token": {"dataType":"string","required":true},
            "refresh_token": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginRequest": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ForgotPasswordResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ForgotPasswordRequest": {
        "dataType": "refObject",
        "properties": {
            "phone": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "VerifyOtpResponse": {
        "dataType": "refObject",
        "properties": {
            "verified": {"dataType":"boolean","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "VerifyOtpRequest": {
        "dataType": "refObject",
        "properties": {
            "phone": {"dataType":"string","required":true},
            "code": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResetPasswordResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResetPasswordRequest": {
        "dataType": "refObject",
        "properties": {
            "phone": {"dataType":"string","required":true},
            "new_password": {"dataType":"string","required":true},
            "confirm_password": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ChangePasswordResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ChangePasswordRequest": {
        "dataType": "refObject",
        "properties": {
            "current_password": {"dataType":"string","required":true},
            "new_password": {"dataType":"string","required":true},
            "confirm_password": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RefreshResponse": {
        "dataType": "refObject",
        "properties": {
            "token": {"dataType":"string","required":true},
            "refresh_token": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RefreshRequest": {
        "dataType": "refObject",
        "properties": {
            "refresh_token": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ActivateResponse": {
        "dataType": "refObject",
        "properties": {
            "activation_token": {"dataType":"string","required":true},
            "requires_profile_setup": {"dataType":"boolean","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ActivateRequest": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "temporary_password": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SetupProfileResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "token": {"dataType":"string","required":true},
            "refresh_token": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SetupProfileRequest": {
        "dataType": "refObject",
        "properties": {
            "first_name": {"dataType":"string","required":true},
            "last_name": {"dataType":"string","required":true},
            "phone": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
            "confirm_password": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdminUserListItem": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "phone": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "role": {"dataType":"string","required":true},
            "last_login": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "joined": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdminUserListResponse": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"AdminUserListItem"},"required":true},
            "meta": {"dataType":"nestedObjectLiteral","nestedProperties":{"limit":{"dataType":"double","required":true},"page":{"dataType":"double","required":true},"total":{"dataType":"double","required":true}},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "InviteAdminResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "InviteAdminRequest": {
        "dataType": "refObject",
        "properties": {
            "first_name": {"dataType":"string","required":true},
            "last_name": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "role_id": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "IdStatusResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.unknown_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdminListResponse_Record_string.unknown__": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refAlias","ref":"Record_string.unknown_"},"required":true},
            "stats": {"ref":"Record_string.unknown_","required":true},
            "meta": {"ref":"PaginationMeta","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdminTransactionDetail": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "ref": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "date": {"dataType":"string","required":true},
            "name": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "amount": {"dataType":"double","required":true},
            "type": {"dataType":"string","required":true},
            "payment_method": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "status": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "MessageResponse": {
        "dataType": "refObject",
        "properties": {
            "message": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PersonSummary": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdminTicketDetail": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "user": {"dataType":"nestedObjectLiteral","nestedProperties":{"email":{"dataType":"string","required":true},"name":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"required":true},
            "title": {"dataType":"string","required":true},
            "message": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
            "assigned_to": {"dataType":"union","subSchemas":[{"ref":"PersonSummary"},{"dataType":"enum","enums":[null]}],"required":true},
            "created_at": {"dataType":"string","required":true},
            "messages": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"created_at":{"dataType":"string","required":true},"body":{"dataType":"string","required":true},"sender":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}}},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdminTicketMessageRequest": {
        "dataType": "refObject",
        "properties": {
            "body": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdminTicketUpdateRequest": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string"},
            "assigned_to": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdminServiceDetail": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "image_url": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "status": {"dataType":"string","required":true},
            "date_added": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RoleListItem": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "display_name": {"dataType":"string","required":true},
            "access": {"dataType":"array","array":{"dataType":"string"},"required":true},
            "user_count": {"dataType":"double","required":true},
            "date_added": {"dataType":"string","required":true},
            "is_system": {"dataType":"boolean","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RoleListResponse": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"RoleListItem"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateRoleResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "access": {"dataType":"array","array":{"dataType":"string"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateRoleRequest": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "display_name": {"dataType":"string","required":true},
            "access": {"dataType":"array","array":{"dataType":"string"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateRoleRequest": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "display_name": {"dataType":"string"},
            "access": {"dataType":"array","array":{"dataType":"string"}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ArchiveRoleResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdminProfileResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "first_name": {"dataType":"string","required":true},
            "last_name": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "email": {"dataType":"string","required":true},
            "phone": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "profile_image_url": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "role": {"dataType":"nestedObjectLiteral","nestedProperties":{"permissions":{"dataType":"array","array":{"dataType":"string"},"required":true},"display_name":{"dataType":"string","required":true},"name":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}},"required":true},
            "status": {"dataType":"string","required":true},
            "created_at": {"dataType":"string","required":true},
            "last_login_at": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateAdminProfileRequest": {
        "dataType": "refObject",
        "properties": {
            "first_name": {"dataType":"string"},
            "last_name": {"dataType":"string"},
            "phone": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Record_string.number_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"double"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DashboardResponse": {
        "dataType": "refObject",
        "properties": {
            "balance": {"dataType":"double","required":true},
            "pending": {"dataType":"double","required":true},
            "total_bookings": {"dataType":"double","required":true},
            "top_clients": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"rating":{"dataType":"double","required":true},"name":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}}},"required":true},
            "top_cleaners": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"rating":{"dataType":"double","required":true},"name":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}}},"required":true},
            "upcoming_bookings": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"total":{"dataType":"double","required":true},"pending":{"dataType":"double","required":true},"started":{"dataType":"double","required":true},"service":{"dataType":"string","required":true}}},"required":true},
            "service_counts": {"ref":"Record_string.number_","required":true},
            "recent_transactions": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"status":{"dataType":"string","required":true},"time":{"dataType":"string","required":true},"date":{"dataType":"string","required":true},"amount":{"dataType":"double","required":true},"type":{"dataType":"string","required":true},"name":{"dataType":"string","required":true},"ref":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}}},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ReviewSnippet": {
        "dataType": "refObject",
        "properties": {
            "rating": {"dataType":"double","required":true},
            "review_text": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "created_at": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdminCustomerDetail": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "phone": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "rating": {"dataType":"double","required":true},
            "joined": {"dataType":"string","required":true},
            "bookings_count": {"dataType":"double","required":true},
            "last_booked": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "reviews": {"dataType":"array","array":{"dataType":"refObject","ref":"ReviewSnippet"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdminCreateBookingRequest": {
        "dataType": "refObject",
        "properties": {
            "customer_name": {"dataType":"string","required":true},
            "location": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "phone": {"dataType":"string","required":true},
            "service_type": {"dataType":"string","required":true},
            "condition": {"dataType":"string"},
            "property_type": {"dataType":"string"},
            "total_sq_metres": {"dataType":"double"},
            "rooms": {"dataType":"double","required":true},
            "floors": {"dataType":"double"},
            "bathrooms": {"dataType":"double","required":true},
            "add_ons": {"dataType":"array","array":{"dataType":"string"}},
            "date": {"dataType":"string","required":true},
            "time_start": {"dataType":"string","required":true},
            "time_end": {"dataType":"string"},
            "cleaning_address": {"dataType":"string","required":true},
            "additional_info": {"dataType":"string"},
            "use_same_cleaner": {"dataType":"boolean"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ContentBlock": {
        "dataType": "refObject",
        "properties": {
            "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["callout"]},{"dataType":"enum","enums":["subtitle"]},{"dataType":"enum","enums":["text"]},{"dataType":"enum","enums":["table"]},{"dataType":"enum","enums":["button"]}],"required":true},
            "title": {"dataType":"string"},
            "text": {"dataType":"string"},
            "rows": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"explanation":{"dataType":"string","required":true},"rate":{"dataType":"string","required":true},"service_category":{"dataType":"string","required":true}}}},
            "url": {"dataType":"string"},
            "label": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateCostGuideRequest": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "content_blocks": {"dataType":"array","array":{"dataType":"refObject","ref":"ContentBlock"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdminCostGuideDetail": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "title": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "content_blocks": {"dataType":"array","array":{"dataType":"refObject","ref":"ContentBlock"},"required":true},
            "status": {"dataType":"string","required":true},
            "date_added": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateCostGuideRequest": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string"},
            "description": {"dataType":"string"},
            "content_blocks": {"dataType":"array","array":{"dataType":"refObject","ref":"ContentBlock"}},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdminCleanerDetail": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "phone": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "rating": {"dataType":"double","required":true},
            "joined": {"dataType":"string","required":true},
            "reviews": {"dataType":"array","array":{"dataType":"refObject","ref":"ReviewSnippet"},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PayCleanerResponse": {
        "dataType": "refObject",
        "properties": {
            "transaction_id": {"dataType":"string","required":true},
            "amount": {"dataType":"double","required":true},
            "status": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PayCleanerRequest": {
        "dataType": "refObject",
        "properties": {
            "amount": {"dataType":"double","required":true},
            "account_number": {"dataType":"string","required":true},
            "bank_name": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdminBookingListItem": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "customer_name": {"dataType":"string","required":true},
            "customer_location": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "service_type": {"dataType":"string","required":true},
            "scheduled_date": {"dataType":"string","required":true},
            "time_start": {"dataType":"string","required":true},
            "time_end": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "status": {"dataType":"string","required":true},
            "total_price": {"dataType":"double","required":true},
            "cleaner_name": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdminListResponse_AdminBookingListItem_": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"AdminBookingListItem"},"required":true},
            "stats": {"ref":"Record_string.unknown_","required":true},
            "meta": {"ref":"PaginationMeta","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PersonDetail": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "name": {"dataType":"string","required":true},
            "email": {"dataType":"string","required":true},
            "phone": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}]},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdminBookingDetail": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "service_type": {"dataType":"string","required":true},
            "booked_on": {"dataType":"string","required":true},
            "booked_for": {"dataType":"nestedObjectLiteral","nestedProperties":{"time_end":{"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},"time_start":{"dataType":"string","required":true},"date":{"dataType":"string","required":true}},"required":true},
            "location": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "price": {"dataType":"double","required":true},
            "payment_method": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "status": {"dataType":"string","required":true},
            "transaction_ref": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "additional_info": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "property_type": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "total_sq_metres": {"dataType":"union","subSchemas":[{"dataType":"double"},{"dataType":"enum","enums":[null]}],"required":true},
            "floors": {"dataType":"double","required":true},
            "rooms": {"dataType":"double","required":true},
            "bathrooms": {"dataType":"double","required":true},
            "customer": {"dataType":"union","subSchemas":[{"ref":"PersonDetail"},{"dataType":"enum","enums":[null]}],"required":true},
            "cleaner": {"dataType":"union","subSchemas":[{"ref":"PersonSummary"},{"dataType":"enum","enums":[null]}],"required":true},
            "images": {"dataType":"array","array":{"dataType":"nestedObjectLiteral","nestedProperties":{"uploaded_at":{"dataType":"string","required":true},"url":{"dataType":"string","required":true},"id":{"dataType":"string","required":true}}},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdminAssignRequest": {
        "dataType": "refObject",
        "properties": {
            "cleaner_id": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AdminRescheduleRequest": {
        "dataType": "refObject",
        "properties": {
            "date": {"dataType":"string","required":true},
            "start_time": {"dataType":"string","required":true},
            "end_time": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ActivityLogItem": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "user": {"dataType":"string","required":true},
            "action": {"dataType":"string","required":true},
            "date": {"dataType":"string","required":true},
            "time": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ActivityLogResponse": {
        "dataType": "refObject",
        "properties": {
            "data": {"dataType":"array","array":{"dataType":"refObject","ref":"ActivityLogItem"},"required":true},
            "meta": {"dataType":"nestedObjectLiteral","nestedProperties":{"limit":{"dataType":"double","required":true},"page":{"dataType":"double","required":true},"total":{"dataType":"double","required":true}},"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AddressResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "street": {"dataType":"string","required":true},
            "floor_number": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "door_number": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "additional_info": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "entrance_notes": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "label": {"dataType":"string","required":true},
            "custom_label": {"dataType":"union","subSchemas":[{"dataType":"string"},{"dataType":"enum","enums":[null]}],"required":true},
            "is_default": {"dataType":"boolean","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AddressLabel": {
        "dataType": "refAlias",
        "type": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["home"]},{"dataType":"enum","enums":["office"]},{"dataType":"enum","enums":["custom"]}],"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateAddressRequest": {
        "dataType": "refObject",
        "properties": {
            "street": {"dataType":"string","required":true},
            "floor_number": {"dataType":"string"},
            "door_number": {"dataType":"string"},
            "additional_info": {"dataType":"string"},
            "entrance_notes": {"dataType":"string"},
            "label": {"ref":"AddressLabel","required":true},
            "custom_label": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateAddressRequest": {
        "dataType": "refObject",
        "properties": {
            "street": {"dataType":"string","required":true},
            "floor_number": {"dataType":"string"},
            "door_number": {"dataType":"string"},
            "additional_info": {"dataType":"string"},
            "entrance_notes": {"dataType":"string"},
            "label": {"ref":"AddressLabel","required":true},
            "custom_label": {"dataType":"string"},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"ignore","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsSupportController_createTicket: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"CreateTicketRequest"},
        };
        app.post('/v1/support/tickets',
            authenticateMiddleware([{"jwt":["customer","cleaner"]}]),
            ...(fetchMiddlewares<RequestHandler>(SupportController)),
            ...(fetchMiddlewares<RequestHandler>(SupportController.prototype.createTicket)),

            async function SupportController_createTicket(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSupportController_createTicket, request, response });

                const controller = new SupportController();

              await templateService.apiHandler({
                methodName: 'createTicket',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsSupportController_listTickets: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                status: {"in":"query","name":"status","dataType":"string"},
                page: {"in":"query","name":"page","dataType":"double"},
                limit: {"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/v1/support/tickets',
            authenticateMiddleware([{"jwt":["customer","cleaner"]}]),
            ...(fetchMiddlewares<RequestHandler>(SupportController)),
            ...(fetchMiddlewares<RequestHandler>(SupportController.prototype.listTickets)),

            async function SupportController_listTickets(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSupportController_listTickets, request, response });

                const controller = new SupportController();

              await templateService.apiHandler({
                methodName: 'listTickets',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsSupportController_getTicket: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/v1/support/tickets/:id',
            authenticateMiddleware([{"jwt":["customer","cleaner"]}]),
            ...(fetchMiddlewares<RequestHandler>(SupportController)),
            ...(fetchMiddlewares<RequestHandler>(SupportController.prototype.getTicket)),

            async function SupportController_getTicket(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsSupportController_getTicket, request, response });

                const controller = new SupportController();

              await templateService.apiHandler({
                methodName: 'getTicket',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsQuotesController_getPricing: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/v1/pricing',
            ...(fetchMiddlewares<RequestHandler>(QuotesController)),
            ...(fetchMiddlewares<RequestHandler>(QuotesController.prototype.getPricing)),

            async function QuotesController_getPricing(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsQuotesController_getPricing, request, response });

                const controller = new QuotesController();

              await templateService.apiHandler({
                methodName: 'getPricing',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsQuotesController_createQuote: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"QuoteRequest"},
        };
        app.post('/v1/quotes',
            ...(fetchMiddlewares<RequestHandler>(QuotesController)),
            ...(fetchMiddlewares<RequestHandler>(QuotesController.prototype.createQuote)),

            async function QuotesController_createQuote(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsQuotesController_createQuote, request, response });

                const controller = new QuotesController();

              await templateService.apiHandler({
                methodName: 'createQuote',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsQuotesController_scheduleQuote: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"QuoteScheduleRequest"},
        };
        app.patch('/v1/quotes/:id/schedule',
            ...(fetchMiddlewares<RequestHandler>(QuotesController)),
            ...(fetchMiddlewares<RequestHandler>(QuotesController.prototype.scheduleQuote)),

            async function QuotesController_scheduleQuote(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsQuotesController_scheduleQuote, request, response });

                const controller = new QuotesController();

              await templateService.apiHandler({
                methodName: 'scheduleQuote',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsProfileController_getCustomerProfile: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/v1/customer/profile',
            authenticateMiddleware([{"jwt":["customer"]}]),
            ...(fetchMiddlewares<RequestHandler>(ProfileController)),
            ...(fetchMiddlewares<RequestHandler>(ProfileController.prototype.getCustomerProfile)),

            async function ProfileController_getCustomerProfile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsProfileController_getCustomerProfile, request, response });

                const controller = new ProfileController();

              await templateService.apiHandler({
                methodName: 'getCustomerProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsProfileController_updateCustomerProfile: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"UpdateProfileRequest"},
        };
        app.patch('/v1/customer/profile',
            authenticateMiddleware([{"jwt":["customer"]}]),
            ...(fetchMiddlewares<RequestHandler>(ProfileController)),
            ...(fetchMiddlewares<RequestHandler>(ProfileController.prototype.updateCustomerProfile)),

            async function ProfileController_updateCustomerProfile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsProfileController_updateCustomerProfile, request, response });

                const controller = new ProfileController();

              await templateService.apiHandler({
                methodName: 'updateCustomerProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsProfileController_requestCustomerPhoneUpdate: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"UpdatePhoneRequest"},
        };
        app.patch('/v1/customer/profile/phone',
            authenticateMiddleware([{"jwt":["customer"]}]),
            ...(fetchMiddlewares<RequestHandler>(ProfileController)),
            ...(fetchMiddlewares<RequestHandler>(ProfileController.prototype.requestCustomerPhoneUpdate)),

            async function ProfileController_requestCustomerPhoneUpdate(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsProfileController_requestCustomerPhoneUpdate, request, response });

                const controller = new ProfileController();

              await templateService.apiHandler({
                methodName: 'requestCustomerPhoneUpdate',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPaymentMethodController_listPaymentMethods: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/v1/customer/payment-methods',
            authenticateMiddleware([{"jwt":["customer"]}]),
            ...(fetchMiddlewares<RequestHandler>(PaymentMethodController)),
            ...(fetchMiddlewares<RequestHandler>(PaymentMethodController.prototype.listPaymentMethods)),

            async function PaymentMethodController_listPaymentMethods(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPaymentMethodController_listPaymentMethods, request, response });

                const controller = new PaymentMethodController();

              await templateService.apiHandler({
                methodName: 'listPaymentMethods',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPaymentMethodController_createPaymentMethod: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"CreatePaymentMethodRequest"},
        };
        app.post('/v1/customer/payment-methods',
            authenticateMiddleware([{"jwt":["customer"]}]),
            ...(fetchMiddlewares<RequestHandler>(PaymentMethodController)),
            ...(fetchMiddlewares<RequestHandler>(PaymentMethodController.prototype.createPaymentMethod)),

            async function PaymentMethodController_createPaymentMethod(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPaymentMethodController_createPaymentMethod, request, response });

                const controller = new PaymentMethodController();

              await templateService.apiHandler({
                methodName: 'createPaymentMethod',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPaymentMethodController_removePaymentMethod: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/v1/customer/payment-methods/:id',
            authenticateMiddleware([{"jwt":["customer"]}]),
            ...(fetchMiddlewares<RequestHandler>(PaymentMethodController)),
            ...(fetchMiddlewares<RequestHandler>(PaymentMethodController.prototype.removePaymentMethod)),

            async function PaymentMethodController_removePaymentMethod(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPaymentMethodController_removePaymentMethod, request, response });

                const controller = new PaymentMethodController();

              await templateService.apiHandler({
                methodName: 'removePaymentMethod',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsNotificationController_listNotifications: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                page: {"in":"query","name":"page","dataType":"double"},
                limit: {"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/v1/notifications',
            authenticateMiddleware([{"jwt":["customer"]}]),
            ...(fetchMiddlewares<RequestHandler>(NotificationController)),
            ...(fetchMiddlewares<RequestHandler>(NotificationController.prototype.listNotifications)),

            async function NotificationController_listNotifications(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsNotificationController_listNotifications, request, response });

                const controller = new NotificationController();

              await templateService.apiHandler({
                methodName: 'listNotifications',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsNotificationController_markRead: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.patch('/v1/notifications/:id/read',
            authenticateMiddleware([{"jwt":["customer"]}]),
            ...(fetchMiddlewares<RequestHandler>(NotificationController)),
            ...(fetchMiddlewares<RequestHandler>(NotificationController.prototype.markRead)),

            async function NotificationController_markRead(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsNotificationController_markRead, request, response });

                const controller = new NotificationController();

              await templateService.apiHandler({
                methodName: 'markRead',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsContactController_submitContactMessage: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"ContactMessageRequest"},
        };
        app.post('/v1/contact-messages',
            ...(fetchMiddlewares<RequestHandler>(ContactController)),
            ...(fetchMiddlewares<RequestHandler>(ContactController.prototype.submitContactMessage)),

            async function ContactController_submitContactMessage(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsContactController_submitContactMessage, request, response });

                const controller = new ContactController();

              await templateService.apiHandler({
                methodName: 'submitContactMessage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsServiceRequestsController_submitServiceRequest: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"ServiceRequestBody"},
        };
        app.post('/v1/service-requests',
            ...(fetchMiddlewares<RequestHandler>(ServiceRequestsController)),
            ...(fetchMiddlewares<RequestHandler>(ServiceRequestsController.prototype.submitServiceRequest)),

            async function ServiceRequestsController_submitServiceRequest(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsServiceRequestsController_submitServiceRequest, request, response });

                const controller = new ServiceRequestsController();

              await templateService.apiHandler({
                methodName: 'submitServiceRequest',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCleanerApplicationsController_submitApplication: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"CleanerApplicationRequest"},
        };
        app.post('/v1/cleaner-applications',
            ...(fetchMiddlewares<RequestHandler>(CleanerApplicationsController)),
            ...(fetchMiddlewares<RequestHandler>(CleanerApplicationsController.prototype.submitApplication)),

            async function CleanerApplicationsController_submitApplication(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCleanerApplicationsController_submitApplication, request, response });

                const controller = new CleanerApplicationsController();

              await templateService.apiHandler({
                methodName: 'submitApplication',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCleanerApplicationsController_getApplication: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/v1/cleaner-applications/:id',
            authenticateMiddleware([{"jwt":["customer","admin:all_users"]}]),
            ...(fetchMiddlewares<RequestHandler>(CleanerApplicationsController)),
            ...(fetchMiddlewares<RequestHandler>(CleanerApplicationsController.prototype.getApplication)),

            async function CleanerApplicationsController_getApplication(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCleanerApplicationsController_getApplication, request, response });

                const controller = new CleanerApplicationsController();

              await templateService.apiHandler({
                methodName: 'getApplication',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCleanerApplicationsController_updateApplication: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"UpdateCleanerApplicationRequest"},
        };
        app.patch('/v1/cleaner-applications/:id',
            authenticateMiddleware([{"jwt":["customer"]}]),
            ...(fetchMiddlewares<RequestHandler>(CleanerApplicationsController)),
            ...(fetchMiddlewares<RequestHandler>(CleanerApplicationsController.prototype.updateApplication)),

            async function CleanerApplicationsController_updateApplication(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCleanerApplicationsController_updateApplication, request, response });

                const controller = new CleanerApplicationsController();

              await templateService.apiHandler({
                methodName: 'updateApplication',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsServicesController_listServices: Record<string, TsoaRoute.ParameterSchema> = {
                search: {"in":"query","name":"search","dataType":"string"},
        };
        app.get('/v1/services',
            ...(fetchMiddlewares<RequestHandler>(ServicesController)),
            ...(fetchMiddlewares<RequestHandler>(ServicesController.prototype.listServices)),

            async function ServicesController_listServices(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsServicesController_listServices, request, response });

                const controller = new ServicesController();

              await templateService.apiHandler({
                methodName: 'listServices',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsServicesController_getService: Record<string, TsoaRoute.ParameterSchema> = {
                slug: {"in":"path","name":"slug","required":true,"dataType":"string"},
        };
        app.get('/v1/services/:slug',
            ...(fetchMiddlewares<RequestHandler>(ServicesController)),
            ...(fetchMiddlewares<RequestHandler>(ServicesController.prototype.getService)),

            async function ServicesController_getService(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsServicesController_getService, request, response });

                const controller = new ServicesController();

              await templateService.apiHandler({
                methodName: 'getService',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBlogController_listCategories: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/v1/blog/categories',
            ...(fetchMiddlewares<RequestHandler>(BlogController)),
            ...(fetchMiddlewares<RequestHandler>(BlogController.prototype.listCategories)),

            async function BlogController_listCategories(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBlogController_listCategories, request, response });

                const controller = new BlogController();

              await templateService.apiHandler({
                methodName: 'listCategories',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBlogController_listPosts: Record<string, TsoaRoute.ParameterSchema> = {
                category: {"in":"query","name":"category","dataType":"string"},
                search: {"in":"query","name":"search","dataType":"string"},
                page: {"in":"query","name":"page","dataType":"double"},
                limit: {"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/v1/blog/posts',
            ...(fetchMiddlewares<RequestHandler>(BlogController)),
            ...(fetchMiddlewares<RequestHandler>(BlogController.prototype.listPosts)),

            async function BlogController_listPosts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBlogController_listPosts, request, response });

                const controller = new BlogController();

              await templateService.apiHandler({
                methodName: 'listPosts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBlogController_getPost: Record<string, TsoaRoute.ParameterSchema> = {
                slug: {"in":"path","name":"slug","required":true,"dataType":"string"},
        };
        app.get('/v1/blog/posts/:slug',
            ...(fetchMiddlewares<RequestHandler>(BlogController)),
            ...(fetchMiddlewares<RequestHandler>(BlogController.prototype.getPost)),

            async function BlogController_getPost(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBlogController_getPost, request, response });

                const controller = new BlogController();

              await templateService.apiHandler({
                methodName: 'getPost',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsFaqsController_listFaqs: Record<string, TsoaRoute.ParameterSchema> = {
                search: {"in":"query","name":"search","dataType":"string"},
        };
        app.get('/v1/faqs',
            ...(fetchMiddlewares<RequestHandler>(FaqsController)),
            ...(fetchMiddlewares<RequestHandler>(FaqsController.prototype.listFaqs)),

            async function FaqsController_listFaqs(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsFaqsController_listFaqs, request, response });

                const controller = new FaqsController();

              await templateService.apiHandler({
                methodName: 'listFaqs',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCostGuidesController_listCostGuides: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/v1/cost-guides',
            ...(fetchMiddlewares<RequestHandler>(CostGuidesController)),
            ...(fetchMiddlewares<RequestHandler>(CostGuidesController.prototype.listCostGuides)),

            async function CostGuidesController_listCostGuides(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCostGuidesController_listCostGuides, request, response });

                const controller = new CostGuidesController();

              await templateService.apiHandler({
                methodName: 'listCostGuides',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCostGuidesController_getCostGuide: Record<string, TsoaRoute.ParameterSchema> = {
                slug: {"in":"path","name":"slug","required":true,"dataType":"string"},
        };
        app.get('/v1/cost-guides/:slug',
            ...(fetchMiddlewares<RequestHandler>(CostGuidesController)),
            ...(fetchMiddlewares<RequestHandler>(CostGuidesController.prototype.getCostGuide)),

            async function CostGuidesController_getCostGuide(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCostGuidesController_getCostGuide, request, response });

                const controller = new CostGuidesController();

              await templateService.apiHandler({
                methodName: 'getCostGuide',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLocationsController_listLocations: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/v1/locations',
            ...(fetchMiddlewares<RequestHandler>(LocationsController)),
            ...(fetchMiddlewares<RequestHandler>(LocationsController.prototype.listLocations)),

            async function LocationsController_listLocations(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLocationsController_listLocations, request, response });

                const controller = new LocationsController();

              await templateService.apiHandler({
                methodName: 'listLocations',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCleanerSecurityController_changePin: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"ChangePinRequest"},
        };
        app.patch('/v1/cleaner/security/pin',
            authenticateMiddleware([{"jwt":["cleaner"]}]),
            ...(fetchMiddlewares<RequestHandler>(CleanerSecurityController)),
            ...(fetchMiddlewares<RequestHandler>(CleanerSecurityController.prototype.changePin)),

            async function CleanerSecurityController_changePin(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCleanerSecurityController_changePin, request, response });

                const controller = new CleanerSecurityController();

              await templateService.apiHandler({
                methodName: 'changePin',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCleanerProfileController_getCleanerProfile: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/v1/cleaner/profile',
            authenticateMiddleware([{"jwt":["cleaner"]}]),
            ...(fetchMiddlewares<RequestHandler>(CleanerProfileController)),
            ...(fetchMiddlewares<RequestHandler>(CleanerProfileController.prototype.getCleanerProfile)),

            async function CleanerProfileController_getCleanerProfile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCleanerProfileController_getCleanerProfile, request, response });

                const controller = new CleanerProfileController();

              await templateService.apiHandler({
                methodName: 'getCleanerProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCleanerProfileController_updateCleanerProfile: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"UpdateCleanerProfileRequest"},
        };
        app.patch('/v1/cleaner/profile',
            authenticateMiddleware([{"jwt":["cleaner"]}]),
            ...(fetchMiddlewares<RequestHandler>(CleanerProfileController)),
            ...(fetchMiddlewares<RequestHandler>(CleanerProfileController.prototype.updateCleanerProfile)),

            async function CleanerProfileController_updateCleanerProfile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCleanerProfileController_updateCleanerProfile, request, response });

                const controller = new CleanerProfileController();

              await templateService.apiHandler({
                methodName: 'updateCleanerProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCleanerProfileController_requestCleanerPhoneUpdate: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"UpdateCleanerPhoneRequest"},
        };
        app.patch('/v1/cleaner/profile/phone',
            authenticateMiddleware([{"jwt":["cleaner"]}]),
            ...(fetchMiddlewares<RequestHandler>(CleanerProfileController)),
            ...(fetchMiddlewares<RequestHandler>(CleanerProfileController.prototype.requestCleanerPhoneUpdate)),

            async function CleanerProfileController_requestCleanerPhoneUpdate(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCleanerProfileController_requestCleanerPhoneUpdate, request, response });

                const controller = new CleanerProfileController();

              await templateService.apiHandler({
                methodName: 'requestCleanerPhoneUpdate',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCleanerProfileController_updateAddress: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"UpdateCleanerAddressRequest"},
        };
        app.patch('/v1/cleaner/profile/address',
            authenticateMiddleware([{"jwt":["cleaner"]}]),
            ...(fetchMiddlewares<RequestHandler>(CleanerProfileController)),
            ...(fetchMiddlewares<RequestHandler>(CleanerProfileController.prototype.updateAddress)),

            async function CleanerProfileController_updateAddress(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCleanerProfileController_updateAddress, request, response });

                const controller = new CleanerProfileController();

              await templateService.apiHandler({
                methodName: 'updateAddress',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCleanerPaymentMethodController_listCleanerPaymentMethods: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/v1/cleaner/payment-methods',
            authenticateMiddleware([{"jwt":["cleaner"]}]),
            ...(fetchMiddlewares<RequestHandler>(CleanerPaymentMethodController)),
            ...(fetchMiddlewares<RequestHandler>(CleanerPaymentMethodController.prototype.listCleanerPaymentMethods)),

            async function CleanerPaymentMethodController_listCleanerPaymentMethods(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCleanerPaymentMethodController_listCleanerPaymentMethods, request, response });

                const controller = new CleanerPaymentMethodController();

              await templateService.apiHandler({
                methodName: 'listCleanerPaymentMethods',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCleanerPaymentMethodController_createCleanerPaymentMethod: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"CreateCleanerPaymentMethodRequest"},
        };
        app.post('/v1/cleaner/payment-methods',
            authenticateMiddleware([{"jwt":["cleaner"]}]),
            ...(fetchMiddlewares<RequestHandler>(CleanerPaymentMethodController)),
            ...(fetchMiddlewares<RequestHandler>(CleanerPaymentMethodController.prototype.createCleanerPaymentMethod)),

            async function CleanerPaymentMethodController_createCleanerPaymentMethod(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCleanerPaymentMethodController_createCleanerPaymentMethod, request, response });

                const controller = new CleanerPaymentMethodController();

              await templateService.apiHandler({
                methodName: 'createCleanerPaymentMethod',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCleanerPaymentMethodController_removeCleanerPaymentMethod: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/v1/cleaner/payment-methods/:id',
            authenticateMiddleware([{"jwt":["cleaner"]}]),
            ...(fetchMiddlewares<RequestHandler>(CleanerPaymentMethodController)),
            ...(fetchMiddlewares<RequestHandler>(CleanerPaymentMethodController.prototype.removeCleanerPaymentMethod)),

            async function CleanerPaymentMethodController_removeCleanerPaymentMethod(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCleanerPaymentMethodController_removeCleanerPaymentMethod, request, response });

                const controller = new CleanerPaymentMethodController();

              await templateService.apiHandler({
                methodName: 'removeCleanerPaymentMethod',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCleanerEarningsController_getSummary: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                period: {"in":"query","name":"period","dataType":"string"},
                start: {"in":"query","name":"start","dataType":"string"},
                end: {"in":"query","name":"end","dataType":"string"},
        };
        app.get('/v1/cleaner/earnings',
            authenticateMiddleware([{"jwt":["cleaner"]}]),
            ...(fetchMiddlewares<RequestHandler>(CleanerEarningsController)),
            ...(fetchMiddlewares<RequestHandler>(CleanerEarningsController.prototype.getSummary)),

            async function CleanerEarningsController_getSummary(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCleanerEarningsController_getSummary, request, response });

                const controller = new CleanerEarningsController();

              await templateService.apiHandler({
                methodName: 'getSummary',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCleanerEarningsController_getIncome: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                period: {"in":"query","name":"period","dataType":"string"},
                start: {"in":"query","name":"start","dataType":"string"},
                end: {"in":"query","name":"end","dataType":"string"},
                page: {"in":"query","name":"page","dataType":"double"},
                limit: {"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/v1/cleaner/earnings/income',
            authenticateMiddleware([{"jwt":["cleaner"]}]),
            ...(fetchMiddlewares<RequestHandler>(CleanerEarningsController)),
            ...(fetchMiddlewares<RequestHandler>(CleanerEarningsController.prototype.getIncome)),

            async function CleanerEarningsController_getIncome(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCleanerEarningsController_getIncome, request, response });

                const controller = new CleanerEarningsController();

              await templateService.apiHandler({
                methodName: 'getIncome',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCleanerEarningsController_getWithdrawals: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                period: {"in":"query","name":"period","dataType":"string"},
                start: {"in":"query","name":"start","dataType":"string"},
                end: {"in":"query","name":"end","dataType":"string"},
                page: {"in":"query","name":"page","dataType":"double"},
                limit: {"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/v1/cleaner/earnings/withdrawals',
            authenticateMiddleware([{"jwt":["cleaner"]}]),
            ...(fetchMiddlewares<RequestHandler>(CleanerEarningsController)),
            ...(fetchMiddlewares<RequestHandler>(CleanerEarningsController.prototype.getWithdrawals)),

            async function CleanerEarningsController_getWithdrawals(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCleanerEarningsController_getWithdrawals, request, response });

                const controller = new CleanerEarningsController();

              await templateService.apiHandler({
                methodName: 'getWithdrawals',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCleanerWithdrawalsController_createWithdrawal: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"CreateWithdrawalRequest"},
        };
        app.post('/v1/cleaner/withdrawals',
            authenticateMiddleware([{"jwt":["cleaner"]}]),
            ...(fetchMiddlewares<RequestHandler>(CleanerWithdrawalsController)),
            ...(fetchMiddlewares<RequestHandler>(CleanerWithdrawalsController.prototype.createWithdrawal)),

            async function CleanerWithdrawalsController_createWithdrawal(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCleanerWithdrawalsController_createWithdrawal, request, response });

                const controller = new CleanerWithdrawalsController();

              await templateService.apiHandler({
                methodName: 'createWithdrawal',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCleanerBookingController_listCleanerBookings: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                filter: {"in":"query","name":"filter","dataType":"string"},
                page: {"in":"query","name":"page","dataType":"double"},
                limit: {"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/v1/cleaner/bookings',
            authenticateMiddleware([{"jwt":["cleaner"]}]),
            ...(fetchMiddlewares<RequestHandler>(CleanerBookingController)),
            ...(fetchMiddlewares<RequestHandler>(CleanerBookingController.prototype.listCleanerBookings)),

            async function CleanerBookingController_listCleanerBookings(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCleanerBookingController_listCleanerBookings, request, response });

                const controller = new CleanerBookingController();

              await templateService.apiHandler({
                methodName: 'listCleanerBookings',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCleanerBookingController_getDetail: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/v1/cleaner/bookings/:id',
            authenticateMiddleware([{"jwt":["cleaner"]}]),
            ...(fetchMiddlewares<RequestHandler>(CleanerBookingController)),
            ...(fetchMiddlewares<RequestHandler>(CleanerBookingController.prototype.getDetail)),

            async function CleanerBookingController_getDetail(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCleanerBookingController_getDetail, request, response });

                const controller = new CleanerBookingController();

              await templateService.apiHandler({
                methodName: 'getDetail',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCleanerBookingController_start: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.post('/v1/cleaner/bookings/:id/start',
            authenticateMiddleware([{"jwt":["cleaner"]}]),
            ...(fetchMiddlewares<RequestHandler>(CleanerBookingController)),
            ...(fetchMiddlewares<RequestHandler>(CleanerBookingController.prototype.start)),

            async function CleanerBookingController_start(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCleanerBookingController_start, request, response });

                const controller = new CleanerBookingController();

              await templateService.apiHandler({
                methodName: 'start',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCleanerBookingController_finish: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.post('/v1/cleaner/bookings/:id/finish',
            authenticateMiddleware([{"jwt":["cleaner"]}]),
            ...(fetchMiddlewares<RequestHandler>(CleanerBookingController)),
            ...(fetchMiddlewares<RequestHandler>(CleanerBookingController.prototype.finish)),

            async function CleanerBookingController_finish(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCleanerBookingController_finish, request, response });

                const controller = new CleanerBookingController();

              await templateService.apiHandler({
                methodName: 'finish',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCleanerBookingController_cancelCleanerBooking: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.post('/v1/cleaner/bookings/:id/cancel',
            authenticateMiddleware([{"jwt":["cleaner"]}]),
            ...(fetchMiddlewares<RequestHandler>(CleanerBookingController)),
            ...(fetchMiddlewares<RequestHandler>(CleanerBookingController.prototype.cancelCleanerBooking)),

            async function CleanerBookingController_cancelCleanerBooking(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCleanerBookingController_cancelCleanerBooking, request, response });

                const controller = new CleanerBookingController();

              await templateService.apiHandler({
                methodName: 'cancelCleanerBooking',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCleanerBookingController_rateCleanerBooking: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"CleanerRateRequest"},
        };
        app.post('/v1/cleaner/bookings/:id/rate',
            authenticateMiddleware([{"jwt":["cleaner"]}]),
            ...(fetchMiddlewares<RequestHandler>(CleanerBookingController)),
            ...(fetchMiddlewares<RequestHandler>(CleanerBookingController.prototype.rateCleanerBooking)),

            async function CleanerBookingController_rateCleanerBooking(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCleanerBookingController_rateCleanerBooking, request, response });

                const controller = new CleanerBookingController();

              await templateService.apiHandler({
                methodName: 'rateCleanerBooking',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCleanerAvailabilityController_getAvailability: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/v1/cleaner/availability',
            authenticateMiddleware([{"jwt":["cleaner"]}]),
            ...(fetchMiddlewares<RequestHandler>(CleanerAvailabilityController)),
            ...(fetchMiddlewares<RequestHandler>(CleanerAvailabilityController.prototype.getAvailability)),

            async function CleanerAvailabilityController_getAvailability(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCleanerAvailabilityController_getAvailability, request, response });

                const controller = new CleanerAvailabilityController();

              await templateService.apiHandler({
                methodName: 'getAvailability',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsCleanerAvailabilityController_updateAvailability: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"UpdateAvailabilityRequest"},
        };
        app.put('/v1/cleaner/availability',
            authenticateMiddleware([{"jwt":["cleaner"]}]),
            ...(fetchMiddlewares<RequestHandler>(CleanerAvailabilityController)),
            ...(fetchMiddlewares<RequestHandler>(CleanerAvailabilityController.prototype.updateAvailability)),

            async function CleanerAvailabilityController_updateAvailability(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsCleanerAvailabilityController_updateAvailability, request, response });

                const controller = new CleanerAvailabilityController();

              await templateService.apiHandler({
                methodName: 'updateAvailability',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBookingController_createBooking: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"CreateBookingRequest"},
        };
        app.post('/v1/bookings',
            authenticateMiddleware([{"jwt":["customer"]}]),
            ...(fetchMiddlewares<RequestHandler>(BookingController)),
            ...(fetchMiddlewares<RequestHandler>(BookingController.prototype.createBooking)),

            async function BookingController_createBooking(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBookingController_createBooking, request, response });

                const controller = new BookingController();

              await templateService.apiHandler({
                methodName: 'createBooking',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBookingController_listBookings: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                status: {"in":"query","name":"status","dataType":"string"},
                page: {"in":"query","name":"page","dataType":"double"},
                limit: {"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/v1/bookings',
            authenticateMiddleware([{"jwt":["customer"]}]),
            ...(fetchMiddlewares<RequestHandler>(BookingController)),
            ...(fetchMiddlewares<RequestHandler>(BookingController.prototype.listBookings)),

            async function BookingController_listBookings(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBookingController_listBookings, request, response });

                const controller = new BookingController();

              await templateService.apiHandler({
                methodName: 'listBookings',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBookingController_get: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/v1/bookings/:id',
            authenticateMiddleware([{"jwt":["customer"]}]),
            ...(fetchMiddlewares<RequestHandler>(BookingController)),
            ...(fetchMiddlewares<RequestHandler>(BookingController.prototype.get)),

            async function BookingController_get(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBookingController_get, request, response });

                const controller = new BookingController();

              await templateService.apiHandler({
                methodName: 'get',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBookingController_pay: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"PayBookingRequest"},
        };
        app.post('/v1/bookings/:id/pay',
            authenticateMiddleware([{"jwt":["customer"]}]),
            ...(fetchMiddlewares<RequestHandler>(BookingController)),
            ...(fetchMiddlewares<RequestHandler>(BookingController.prototype.pay)),

            async function BookingController_pay(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBookingController_pay, request, response });

                const controller = new BookingController();

              await templateService.apiHandler({
                methodName: 'pay',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBookingController_amend: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"AmendBookingRequest"},
        };
        app.patch('/v1/bookings/:id/amend',
            authenticateMiddleware([{"jwt":["customer"]}]),
            ...(fetchMiddlewares<RequestHandler>(BookingController)),
            ...(fetchMiddlewares<RequestHandler>(BookingController.prototype.amend)),

            async function BookingController_amend(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBookingController_amend, request, response });

                const controller = new BookingController();

              await templateService.apiHandler({
                methodName: 'amend',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBookingController_reschedule: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"RescheduleBookingRequest"},
        };
        app.patch('/v1/bookings/:id/reschedule',
            authenticateMiddleware([{"jwt":["customer"]}]),
            ...(fetchMiddlewares<RequestHandler>(BookingController)),
            ...(fetchMiddlewares<RequestHandler>(BookingController.prototype.reschedule)),

            async function BookingController_reschedule(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBookingController_reschedule, request, response });

                const controller = new BookingController();

              await templateService.apiHandler({
                methodName: 'reschedule',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBookingController_cancelBooking: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.post('/v1/bookings/:id/cancel',
            authenticateMiddleware([{"jwt":["customer"]}]),
            ...(fetchMiddlewares<RequestHandler>(BookingController)),
            ...(fetchMiddlewares<RequestHandler>(BookingController.prototype.cancelBooking)),

            async function BookingController_cancelBooking(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBookingController_cancelBooking, request, response });

                const controller = new BookingController();

              await templateService.apiHandler({
                methodName: 'cancelBooking',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBookingController_rebook: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.post('/v1/bookings/:id/rebook',
            authenticateMiddleware([{"jwt":["customer"]}]),
            ...(fetchMiddlewares<RequestHandler>(BookingController)),
            ...(fetchMiddlewares<RequestHandler>(BookingController.prototype.rebook)),

            async function BookingController_rebook(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBookingController_rebook, request, response });

                const controller = new BookingController();

              await templateService.apiHandler({
                methodName: 'rebook',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBookingController_rateBooking: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"RateBookingRequest"},
        };
        app.post('/v1/bookings/:id/rate',
            authenticateMiddleware([{"jwt":["customer"]}]),
            ...(fetchMiddlewares<RequestHandler>(BookingController)),
            ...(fetchMiddlewares<RequestHandler>(BookingController.prototype.rateBooking)),

            async function BookingController_rateBooking(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBookingController_rateBooking, request, response });

                const controller = new BookingController();

              await templateService.apiHandler({
                methodName: 'rateBooking',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBookingController_changeCleaner: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.post('/v1/bookings/:id/change-cleaner',
            authenticateMiddleware([{"jwt":["customer"]}]),
            ...(fetchMiddlewares<RequestHandler>(BookingController)),
            ...(fetchMiddlewares<RequestHandler>(BookingController.prototype.changeCleaner)),

            async function BookingController_changeCleaner(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBookingController_changeCleaner, request, response });

                const controller = new BookingController();

              await templateService.apiHandler({
                methodName: 'changeCleaner',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBookingController_images: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/v1/bookings/:id/images',
            authenticateMiddleware([{"jwt":["customer","cleaner","admin:bookings"]}]),
            ...(fetchMiddlewares<RequestHandler>(BookingController)),
            ...(fetchMiddlewares<RequestHandler>(BookingController.prototype.images)),

            async function BookingController_images(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBookingController_images, request, response });

                const controller = new BookingController();

              await templateService.apiHandler({
                methodName: 'images',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsBookingController_receipt: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/v1/bookings/:id/receipt',
            authenticateMiddleware([{"jwt":["customer"]}]),
            ...(fetchMiddlewares<RequestHandler>(BookingController)),
            ...(fetchMiddlewares<RequestHandler>(BookingController.prototype.receipt)),

            async function BookingController_receipt(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsBookingController_receipt, request, response });

                const controller = new BookingController();

              await templateService.apiHandler({
                methodName: 'receipt',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_register: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"RegisterRequest"},
        };
        app.post('/v1/auth/register',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.register)),

            async function AuthController_register(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_register, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'register',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_login: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"LoginRequest"},
        };
        app.post('/v1/auth/login',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.login)),

            async function AuthController_login(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_login, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_forgotPassword: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"ForgotPasswordRequest"},
        };
        app.post('/v1/auth/forgot-password',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.forgotPassword)),

            async function AuthController_forgotPassword(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_forgotPassword, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'forgotPassword',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_verifyOtp: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"VerifyOtpRequest"},
        };
        app.post('/v1/auth/verify-otp',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.verifyOtp)),

            async function AuthController_verifyOtp(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_verifyOtp, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'verifyOtp',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_resetPassword: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"ResetPasswordRequest"},
        };
        app.post('/v1/auth/reset-password',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.resetPassword)),

            async function AuthController_resetPassword(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_resetPassword, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'resetPassword',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_changePassword: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"ChangePasswordRequest"},
        };
        app.post('/v1/auth/change-password',
            authenticateMiddleware([{"jwt":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.changePassword)),

            async function AuthController_changePassword(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_changePassword, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'changePassword',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_refresh: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"RefreshRequest"},
        };
        app.post('/v1/auth/refresh',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.refresh)),

            async function AuthController_refresh(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_refresh, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'refresh',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_activate: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"ActivateRequest"},
        };
        app.post('/v1/auth/activate',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.activate)),

            async function AuthController_activate(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_activate, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'activate',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_setupProfile: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"SetupProfileRequest"},
        };
        app.post('/v1/auth/setup-profile',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.setupProfile)),

            async function AuthController_setupProfile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_setupProfile, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'setupProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminUserController_listAdminUsers: Record<string, TsoaRoute.ParameterSchema> = {
                _req: {"in":"request","name":"_req","required":true,"dataType":"object"},
                page: {"default":1,"in":"query","name":"page","dataType":"double"},
                limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
                status: {"in":"query","name":"status","dataType":"string"},
                search: {"in":"query","name":"search","dataType":"string"},
        };
        app.get('/v1/admin/users',
            authenticateMiddleware([{"jwt":["admin:all_users"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminUserController)),
            ...(fetchMiddlewares<RequestHandler>(AdminUserController.prototype.listAdminUsers)),

            async function AdminUserController_listAdminUsers(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminUserController_listAdminUsers, request, response });

                const controller = new AdminUserController();

              await templateService.apiHandler({
                methodName: 'listAdminUsers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminUserController_inviteAdmin: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"InviteAdminRequest"},
        };
        app.post('/v1/admin/users',
            authenticateMiddleware([{"jwt":["admin:all_users"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminUserController)),
            ...(fetchMiddlewares<RequestHandler>(AdminUserController.prototype.inviteAdmin)),

            async function AdminUserController_inviteAdmin(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminUserController_inviteAdmin, request, response });

                const controller = new AdminUserController();

              await templateService.apiHandler({
                methodName: 'inviteAdmin',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminUserController_blockAdminUser: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.post('/v1/admin/users/:id/block',
            authenticateMiddleware([{"jwt":["admin:all_users"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminUserController)),
            ...(fetchMiddlewares<RequestHandler>(AdminUserController.prototype.blockAdminUser)),

            async function AdminUserController_blockAdminUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminUserController_blockAdminUser, request, response });

                const controller = new AdminUserController();

              await templateService.apiHandler({
                methodName: 'blockAdminUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminTransactionController_listTransactions: Record<string, TsoaRoute.ParameterSchema> = {
                _req: {"in":"request","name":"_req","required":true,"dataType":"object"},
                page: {"default":1,"in":"query","name":"page","dataType":"double"},
                limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
                period: {"in":"query","name":"period","dataType":"string"},
                type: {"in":"query","name":"type","dataType":"string"},
                search: {"in":"query","name":"search","dataType":"string"},
        };
        app.get('/v1/admin/transactions',
            authenticateMiddleware([{"jwt":["admin:transactions"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminTransactionController)),
            ...(fetchMiddlewares<RequestHandler>(AdminTransactionController.prototype.listTransactions)),

            async function AdminTransactionController_listTransactions(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminTransactionController_listTransactions, request, response });

                const controller = new AdminTransactionController();

              await templateService.apiHandler({
                methodName: 'listTransactions',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminTransactionController_getTransaction: Record<string, TsoaRoute.ParameterSchema> = {
                _req: {"in":"request","name":"_req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/v1/admin/transactions/:id',
            authenticateMiddleware([{"jwt":["admin:transactions"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminTransactionController)),
            ...(fetchMiddlewares<RequestHandler>(AdminTransactionController.prototype.getTransaction)),

            async function AdminTransactionController_getTransaction(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminTransactionController_getTransaction, request, response });

                const controller = new AdminTransactionController();

              await templateService.apiHandler({
                methodName: 'getTransaction',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminTransactionController_sendTransactionReceipt: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.post('/v1/admin/transactions/:id/receipt',
            authenticateMiddleware([{"jwt":["admin:transactions"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminTransactionController)),
            ...(fetchMiddlewares<RequestHandler>(AdminTransactionController.prototype.sendTransactionReceipt)),

            async function AdminTransactionController_sendTransactionReceipt(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminTransactionController_sendTransactionReceipt, request, response });

                const controller = new AdminTransactionController();

              await templateService.apiHandler({
                methodName: 'sendTransactionReceipt',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminSupportController_listAdminTickets: Record<string, TsoaRoute.ParameterSchema> = {
                _req: {"in":"request","name":"_req","required":true,"dataType":"object"},
                page: {"default":1,"in":"query","name":"page","dataType":"double"},
                limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
                status: {"in":"query","name":"status","dataType":"string"},
                search: {"in":"query","name":"search","dataType":"string"},
        };
        app.get('/v1/admin/support/tickets',
            authenticateMiddleware([{"jwt":["admin:support"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminSupportController)),
            ...(fetchMiddlewares<RequestHandler>(AdminSupportController.prototype.listAdminTickets)),

            async function AdminSupportController_listAdminTickets(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminSupportController_listAdminTickets, request, response });

                const controller = new AdminSupportController();

              await templateService.apiHandler({
                methodName: 'listAdminTickets',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminSupportController_getAdminTicket: Record<string, TsoaRoute.ParameterSchema> = {
                _req: {"in":"request","name":"_req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/v1/admin/support/tickets/:id',
            authenticateMiddleware([{"jwt":["admin:support"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminSupportController)),
            ...(fetchMiddlewares<RequestHandler>(AdminSupportController.prototype.getAdminTicket)),

            async function AdminSupportController_getAdminTicket(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminSupportController_getAdminTicket, request, response });

                const controller = new AdminSupportController();

              await templateService.apiHandler({
                methodName: 'getAdminTicket',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminSupportController_addMessage: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"AdminTicketMessageRequest"},
        };
        app.post('/v1/admin/support/tickets/:id/messages',
            authenticateMiddleware([{"jwt":["admin:support"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminSupportController)),
            ...(fetchMiddlewares<RequestHandler>(AdminSupportController.prototype.addMessage)),

            async function AdminSupportController_addMessage(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminSupportController_addMessage, request, response });

                const controller = new AdminSupportController();

              await templateService.apiHandler({
                methodName: 'addMessage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminSupportController_updateTicket: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"AdminTicketUpdateRequest"},
        };
        app.patch('/v1/admin/support/tickets/:id',
            authenticateMiddleware([{"jwt":["admin:support"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminSupportController)),
            ...(fetchMiddlewares<RequestHandler>(AdminSupportController.prototype.updateTicket)),

            async function AdminSupportController_updateTicket(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminSupportController_updateTicket, request, response });

                const controller = new AdminSupportController();

              await templateService.apiHandler({
                methodName: 'updateTicket',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminServiceController_listAdminServices: Record<string, TsoaRoute.ParameterSchema> = {
                _req: {"in":"request","name":"_req","required":true,"dataType":"object"},
        };
        app.get('/v1/admin/services',
            authenticateMiddleware([{"jwt":["admin:services"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminServiceController)),
            ...(fetchMiddlewares<RequestHandler>(AdminServiceController.prototype.listAdminServices)),

            async function AdminServiceController_listAdminServices(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminServiceController_listAdminServices, request, response });

                const controller = new AdminServiceController();

              await templateService.apiHandler({
                methodName: 'listAdminServices',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminServiceController_getAdminService: Record<string, TsoaRoute.ParameterSchema> = {
                _req: {"in":"request","name":"_req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/v1/admin/services/:id',
            authenticateMiddleware([{"jwt":["admin:services"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminServiceController)),
            ...(fetchMiddlewares<RequestHandler>(AdminServiceController.prototype.getAdminService)),

            async function AdminServiceController_getAdminService(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminServiceController_getAdminService, request, response });

                const controller = new AdminServiceController();

              await templateService.apiHandler({
                methodName: 'getAdminService',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminServiceController_archiveService: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.patch('/v1/admin/services/:id/archive',
            authenticateMiddleware([{"jwt":["admin:services"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminServiceController)),
            ...(fetchMiddlewares<RequestHandler>(AdminServiceController.prototype.archiveService)),

            async function AdminServiceController_archiveService(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminServiceController_archiveService, request, response });

                const controller = new AdminServiceController();

              await templateService.apiHandler({
                methodName: 'archiveService',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminRoleController_listRoles: Record<string, TsoaRoute.ParameterSchema> = {
                _req: {"in":"request","name":"_req","required":true,"dataType":"object"},
        };
        app.get('/v1/admin/roles',
            authenticateMiddleware([{"jwt":["admin:control_permissions"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminRoleController)),
            ...(fetchMiddlewares<RequestHandler>(AdminRoleController.prototype.listRoles)),

            async function AdminRoleController_listRoles(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminRoleController_listRoles, request, response });

                const controller = new AdminRoleController();

              await templateService.apiHandler({
                methodName: 'listRoles',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminRoleController_createRole: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"CreateRoleRequest"},
        };
        app.post('/v1/admin/roles',
            authenticateMiddleware([{"jwt":["admin:control_permissions"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminRoleController)),
            ...(fetchMiddlewares<RequestHandler>(AdminRoleController.prototype.createRole)),

            async function AdminRoleController_createRole(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminRoleController_createRole, request, response });

                const controller = new AdminRoleController();

              await templateService.apiHandler({
                methodName: 'createRole',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminRoleController_updateRole: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"UpdateRoleRequest"},
        };
        app.patch('/v1/admin/roles/:id',
            authenticateMiddleware([{"jwt":["admin:control_permissions"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminRoleController)),
            ...(fetchMiddlewares<RequestHandler>(AdminRoleController.prototype.updateRole)),

            async function AdminRoleController_updateRole(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminRoleController_updateRole, request, response });

                const controller = new AdminRoleController();

              await templateService.apiHandler({
                methodName: 'updateRole',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminRoleController_archiveRole: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.patch('/v1/admin/roles/:id/archive',
            authenticateMiddleware([{"jwt":["admin:control_permissions"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminRoleController)),
            ...(fetchMiddlewares<RequestHandler>(AdminRoleController.prototype.archiveRole)),

            async function AdminRoleController_archiveRole(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminRoleController_archiveRole, request, response });

                const controller = new AdminRoleController();

              await templateService.apiHandler({
                methodName: 'archiveRole',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminProfileController_getAdminProfile: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/v1/admin/profile',
            authenticateMiddleware([{"jwt":["admin:home"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminProfileController)),
            ...(fetchMiddlewares<RequestHandler>(AdminProfileController.prototype.getAdminProfile)),

            async function AdminProfileController_getAdminProfile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminProfileController_getAdminProfile, request, response });

                const controller = new AdminProfileController();

              await templateService.apiHandler({
                methodName: 'getAdminProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminProfileController_updateAdminProfile: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"UpdateAdminProfileRequest"},
        };
        app.patch('/v1/admin/profile',
            authenticateMiddleware([{"jwt":["admin:home"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminProfileController)),
            ...(fetchMiddlewares<RequestHandler>(AdminProfileController.prototype.updateAdminProfile)),

            async function AdminProfileController_updateAdminProfile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminProfileController_updateAdminProfile, request, response });

                const controller = new AdminProfileController();

              await templateService.apiHandler({
                methodName: 'updateAdminProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminDashboardController_getDashboard: Record<string, TsoaRoute.ParameterSchema> = {
                _req: {"in":"request","name":"_req","required":true,"dataType":"object"},
        };
        app.get('/v1/admin/dashboard',
            authenticateMiddleware([{"jwt":["admin:home"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminDashboardController)),
            ...(fetchMiddlewares<RequestHandler>(AdminDashboardController.prototype.getDashboard)),

            async function AdminDashboardController_getDashboard(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminDashboardController_getDashboard, request, response });

                const controller = new AdminDashboardController();

              await templateService.apiHandler({
                methodName: 'getDashboard',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminCustomerController_listCustomers: Record<string, TsoaRoute.ParameterSchema> = {
                _req: {"in":"request","name":"_req","required":true,"dataType":"object"},
                page: {"default":1,"in":"query","name":"page","dataType":"double"},
                limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
                status: {"in":"query","name":"status","dataType":"string"},
                location: {"in":"query","name":"location","dataType":"string"},
                service: {"in":"query","name":"service","dataType":"string"},
                search: {"in":"query","name":"search","dataType":"string"},
        };
        app.get('/v1/admin/customers',
            authenticateMiddleware([{"jwt":["admin:customers"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminCustomerController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCustomerController.prototype.listCustomers)),

            async function AdminCustomerController_listCustomers(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCustomerController_listCustomers, request, response });

                const controller = new AdminCustomerController();

              await templateService.apiHandler({
                methodName: 'listCustomers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminCustomerController_getCustomer: Record<string, TsoaRoute.ParameterSchema> = {
                _req: {"in":"request","name":"_req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/v1/admin/customers/:id',
            authenticateMiddleware([{"jwt":["admin:customers"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminCustomerController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCustomerController.prototype.getCustomer)),

            async function AdminCustomerController_getCustomer(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCustomerController_getCustomer, request, response });

                const controller = new AdminCustomerController();

              await templateService.apiHandler({
                methodName: 'getCustomer',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminCustomerController_blockCustomer: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.post('/v1/admin/customers/:id/block',
            authenticateMiddleware([{"jwt":["admin:customers"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminCustomerController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCustomerController.prototype.blockCustomer)),

            async function AdminCustomerController_blockCustomer(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCustomerController_blockCustomer, request, response });

                const controller = new AdminCustomerController();

              await templateService.apiHandler({
                methodName: 'blockCustomer',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminCustomerController_bookForCustomer: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"AdminCreateBookingRequest"},
        };
        app.post('/v1/admin/customers/:id/book',
            authenticateMiddleware([{"jwt":["admin:customers"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminCustomerController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCustomerController.prototype.bookForCustomer)),

            async function AdminCustomerController_bookForCustomer(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCustomerController_bookForCustomer, request, response });

                const controller = new AdminCustomerController();

              await templateService.apiHandler({
                methodName: 'bookForCustomer',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminCostGuideController_listAdminCostGuides: Record<string, TsoaRoute.ParameterSchema> = {
                _req: {"in":"request","name":"_req","required":true,"dataType":"object"},
        };
        app.get('/v1/admin/cost-guides',
            authenticateMiddleware([{"jwt":["admin:services"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminCostGuideController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCostGuideController.prototype.listAdminCostGuides)),

            async function AdminCostGuideController_listAdminCostGuides(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCostGuideController_listAdminCostGuides, request, response });

                const controller = new AdminCostGuideController();

              await templateService.apiHandler({
                methodName: 'listAdminCostGuides',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminCostGuideController_createCostGuide: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"CreateCostGuideRequest"},
        };
        app.post('/v1/admin/cost-guides',
            authenticateMiddleware([{"jwt":["admin:services"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminCostGuideController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCostGuideController.prototype.createCostGuide)),

            async function AdminCostGuideController_createCostGuide(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCostGuideController_createCostGuide, request, response });

                const controller = new AdminCostGuideController();

              await templateService.apiHandler({
                methodName: 'createCostGuide',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminCostGuideController_getAdminCostGuide: Record<string, TsoaRoute.ParameterSchema> = {
                _req: {"in":"request","name":"_req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/v1/admin/cost-guides/:id',
            authenticateMiddleware([{"jwt":["admin:services"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminCostGuideController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCostGuideController.prototype.getAdminCostGuide)),

            async function AdminCostGuideController_getAdminCostGuide(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCostGuideController_getAdminCostGuide, request, response });

                const controller = new AdminCostGuideController();

              await templateService.apiHandler({
                methodName: 'getAdminCostGuide',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminCostGuideController_updateCostGuide: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"UpdateCostGuideRequest"},
        };
        app.patch('/v1/admin/cost-guides/:id',
            authenticateMiddleware([{"jwt":["admin:services"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminCostGuideController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCostGuideController.prototype.updateCostGuide)),

            async function AdminCostGuideController_updateCostGuide(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCostGuideController_updateCostGuide, request, response });

                const controller = new AdminCostGuideController();

              await templateService.apiHandler({
                methodName: 'updateCostGuide',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminCostGuideController_archiveCostGuide: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.patch('/v1/admin/cost-guides/:id/archive',
            authenticateMiddleware([{"jwt":["admin:services"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminCostGuideController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCostGuideController.prototype.archiveCostGuide)),

            async function AdminCostGuideController_archiveCostGuide(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCostGuideController_archiveCostGuide, request, response });

                const controller = new AdminCostGuideController();

              await templateService.apiHandler({
                methodName: 'archiveCostGuide',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminCleanerController_listCleaners: Record<string, TsoaRoute.ParameterSchema> = {
                _req: {"in":"request","name":"_req","required":true,"dataType":"object"},
                page: {"default":1,"in":"query","name":"page","dataType":"double"},
                limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
                status: {"in":"query","name":"status","dataType":"string"},
                location: {"in":"query","name":"location","dataType":"string"},
                service: {"in":"query","name":"service","dataType":"string"},
                search: {"in":"query","name":"search","dataType":"string"},
        };
        app.get('/v1/admin/cleaners',
            authenticateMiddleware([{"jwt":["admin:cleaners"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminCleanerController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCleanerController.prototype.listCleaners)),

            async function AdminCleanerController_listCleaners(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCleanerController_listCleaners, request, response });

                const controller = new AdminCleanerController();

              await templateService.apiHandler({
                methodName: 'listCleaners',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminCleanerController_getCleaner: Record<string, TsoaRoute.ParameterSchema> = {
                _req: {"in":"request","name":"_req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/v1/admin/cleaners/:id',
            authenticateMiddleware([{"jwt":["admin:cleaners"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminCleanerController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCleanerController.prototype.getCleaner)),

            async function AdminCleanerController_getCleaner(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCleanerController_getCleaner, request, response });

                const controller = new AdminCleanerController();

              await templateService.apiHandler({
                methodName: 'getCleaner',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminCleanerController_blockCleaner: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.post('/v1/admin/cleaners/:id/block',
            authenticateMiddleware([{"jwt":["admin:cleaners"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminCleanerController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCleanerController.prototype.blockCleaner)),

            async function AdminCleanerController_blockCleaner(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCleanerController_blockCleaner, request, response });

                const controller = new AdminCleanerController();

              await templateService.apiHandler({
                methodName: 'blockCleaner',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminCleanerController_payCleaner: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"PayCleanerRequest"},
        };
        app.post('/v1/admin/cleaners/:id/pay',
            authenticateMiddleware([{"jwt":["admin:cleaners"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminCleanerController)),
            ...(fetchMiddlewares<RequestHandler>(AdminCleanerController.prototype.payCleaner)),

            async function AdminCleanerController_payCleaner(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminCleanerController_payCleaner, request, response });

                const controller = new AdminCleanerController();

              await templateService.apiHandler({
                methodName: 'payCleaner',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminBookingController_adminListBookings: Record<string, TsoaRoute.ParameterSchema> = {
                _req: {"in":"request","name":"_req","required":true,"dataType":"object"},
                page: {"default":1,"in":"query","name":"page","dataType":"double"},
                limit: {"default":10,"in":"query","name":"limit","dataType":"double"},
                date: {"in":"query","name":"date","dataType":"string"},
                location: {"in":"query","name":"location","dataType":"string"},
                service: {"in":"query","name":"service","dataType":"string"},
                status: {"in":"query","name":"status","dataType":"string"},
                search: {"in":"query","name":"search","dataType":"string"},
        };
        app.get('/v1/admin/bookings',
            authenticateMiddleware([{"jwt":["admin:bookings"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminBookingController)),
            ...(fetchMiddlewares<RequestHandler>(AdminBookingController.prototype.adminListBookings)),

            async function AdminBookingController_adminListBookings(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminBookingController_adminListBookings, request, response });

                const controller = new AdminBookingController();

              await templateService.apiHandler({
                methodName: 'adminListBookings',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminBookingController_adminCreateBooking: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"AdminCreateBookingRequest"},
        };
        app.post('/v1/admin/bookings',
            authenticateMiddleware([{"jwt":["admin:bookings"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminBookingController)),
            ...(fetchMiddlewares<RequestHandler>(AdminBookingController.prototype.adminCreateBooking)),

            async function AdminBookingController_adminCreateBooking(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminBookingController_adminCreateBooking, request, response });

                const controller = new AdminBookingController();

              await templateService.apiHandler({
                methodName: 'adminCreateBooking',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminBookingController_getBooking: Record<string, TsoaRoute.ParameterSchema> = {
                _req: {"in":"request","name":"_req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/v1/admin/bookings/:id',
            authenticateMiddleware([{"jwt":["admin:bookings"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminBookingController)),
            ...(fetchMiddlewares<RequestHandler>(AdminBookingController.prototype.getBooking)),

            async function AdminBookingController_getBooking(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminBookingController_getBooking, request, response });

                const controller = new AdminBookingController();

              await templateService.apiHandler({
                methodName: 'getBooking',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminBookingController_assignCleaner: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"AdminAssignRequest"},
        };
        app.post('/v1/admin/bookings/:id/assign',
            authenticateMiddleware([{"jwt":["admin:bookings"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminBookingController)),
            ...(fetchMiddlewares<RequestHandler>(AdminBookingController.prototype.assignCleaner)),

            async function AdminBookingController_assignCleaner(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminBookingController_assignCleaner, request, response });

                const controller = new AdminBookingController();

              await templateService.apiHandler({
                methodName: 'assignCleaner',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminBookingController_rescheduleBooking: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"AdminRescheduleRequest"},
        };
        app.patch('/v1/admin/bookings/:id/reschedule',
            authenticateMiddleware([{"jwt":["admin:bookings"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminBookingController)),
            ...(fetchMiddlewares<RequestHandler>(AdminBookingController.prototype.rescheduleBooking)),

            async function AdminBookingController_rescheduleBooking(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminBookingController_rescheduleBooking, request, response });

                const controller = new AdminBookingController();

              await templateService.apiHandler({
                methodName: 'rescheduleBooking',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminBookingController_adminCancelBooking: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.post('/v1/admin/bookings/:id/cancel',
            authenticateMiddleware([{"jwt":["admin:bookings"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminBookingController)),
            ...(fetchMiddlewares<RequestHandler>(AdminBookingController.prototype.adminCancelBooking)),

            async function AdminBookingController_adminCancelBooking(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminBookingController_adminCancelBooking, request, response });

                const controller = new AdminBookingController();

              await templateService.apiHandler({
                methodName: 'adminCancelBooking',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminBookingController_sendBookingReceipt: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.post('/v1/admin/bookings/:id/receipt',
            authenticateMiddleware([{"jwt":["admin:bookings"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminBookingController)),
            ...(fetchMiddlewares<RequestHandler>(AdminBookingController.prototype.sendBookingReceipt)),

            async function AdminBookingController_sendBookingReceipt(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminBookingController_sendBookingReceipt, request, response });

                const controller = new AdminBookingController();

              await templateService.apiHandler({
                methodName: 'sendBookingReceipt',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAdminActivityLogController_getActivityLog: Record<string, TsoaRoute.ParameterSchema> = {
                _req: {"in":"request","name":"_req","required":true,"dataType":"object"},
                page: {"default":1,"in":"query","name":"page","dataType":"double"},
                limit: {"default":20,"in":"query","name":"limit","dataType":"double"},
                search: {"in":"query","name":"search","dataType":"string"},
        };
        app.get('/v1/admin/activity-log',
            authenticateMiddleware([{"jwt":["admin:control_permissions"]}]),
            ...(fetchMiddlewares<RequestHandler>(AdminActivityLogController)),
            ...(fetchMiddlewares<RequestHandler>(AdminActivityLogController.prototype.getActivityLog)),

            async function AdminActivityLogController_getActivityLog(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAdminActivityLogController_getActivityLog, request, response });

                const controller = new AdminActivityLogController();

              await templateService.apiHandler({
                methodName: 'getActivityLog',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAddressController_listAddresses: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/v1/customer/addresses',
            authenticateMiddleware([{"jwt":["customer"]}]),
            ...(fetchMiddlewares<RequestHandler>(AddressController)),
            ...(fetchMiddlewares<RequestHandler>(AddressController.prototype.listAddresses)),

            async function AddressController_listAddresses(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAddressController_listAddresses, request, response });

                const controller = new AddressController();

              await templateService.apiHandler({
                methodName: 'listAddresses',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAddressController_getById: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/v1/customer/addresses/:id',
            authenticateMiddleware([{"jwt":["customer"]}]),
            ...(fetchMiddlewares<RequestHandler>(AddressController)),
            ...(fetchMiddlewares<RequestHandler>(AddressController.prototype.getById)),

            async function AddressController_getById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAddressController_getById, request, response });

                const controller = new AddressController();

              await templateService.apiHandler({
                methodName: 'getById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAddressController_createAddress: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"CreateAddressRequest"},
        };
        app.post('/v1/customer/addresses',
            authenticateMiddleware([{"jwt":["customer"]}]),
            ...(fetchMiddlewares<RequestHandler>(AddressController)),
            ...(fetchMiddlewares<RequestHandler>(AddressController.prototype.createAddress)),

            async function AddressController_createAddress(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAddressController_createAddress, request, response });

                const controller = new AddressController();

              await templateService.apiHandler({
                methodName: 'createAddress',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAddressController_update: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                body: {"in":"body","name":"body","required":true,"ref":"UpdateAddressRequest"},
        };
        app.put('/v1/customer/addresses/:id',
            authenticateMiddleware([{"jwt":["customer"]}]),
            ...(fetchMiddlewares<RequestHandler>(AddressController)),
            ...(fetchMiddlewares<RequestHandler>(AddressController.prototype.update)),

            async function AddressController_update(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAddressController_update, request, response });

                const controller = new AddressController();

              await templateService.apiHandler({
                methodName: 'update',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAddressController_removeAddress: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/v1/customer/addresses/:id',
            authenticateMiddleware([{"jwt":["customer"]}]),
            ...(fetchMiddlewares<RequestHandler>(AddressController)),
            ...(fetchMiddlewares<RequestHandler>(AddressController.prototype.removeAddress)),

            async function AddressController_removeAddress(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAddressController_removeAddress, request, response });

                const controller = new AddressController();

              await templateService.apiHandler({
                methodName: 'removeAddress',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 204,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
