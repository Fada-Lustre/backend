/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { QuotesController } from './controllers/QuotesController';
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
import { AuthController } from './controllers/AuthController';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
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
    "ErrorResponse": {
        "dataType": "refObject",
        "properties": {
            "error": {"dataType":"nestedObjectLiteral","nestedProperties":{"details":{"dataType":"any"},"message":{"dataType":"string","required":true},"code":{"dataType":"string","required":true}},"required":true},
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
    "PaginationMeta": {
        "dataType": "refObject",
        "properties": {
            "total": {"dataType":"double","required":true},
            "page": {"dataType":"double"},
            "limit": {"dataType":"double"},
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
            "email": {"dataType":"string","required":true},
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
        app.post('/v1/quotes/:id/schedule',
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
        const argsAuthController_refresh: Record<string, TsoaRoute.ParameterSchema> = {
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

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
