import * as Yup from "yup";

import {
  schema_obj,
  warehouse_owner_obj,
  lessee_details_obj,
  clients_details_obj,
  chamber_details_obj,
  oil_tank_details_obj,
  silo_details_obj,
} from "./all_warhouse_inspection_schema_obj";

// form schema
const form_schema = Yup.object().shape({
  form_edit: Yup.string(),
  is_draftable: Yup.string(),
  [schema_obj.first_accordion.hiring_proposal]: Yup.string().required(""),
  [schema_obj.first_accordion.warehouse_type]: Yup.string().required(""),
  [schema_obj.first_accordion.warehouse_sub_type]: Yup.string().required(""),
  [schema_obj.first_accordion.warehouse_unit_type]: Yup.string().required(),
  [schema_obj.first_accordion.warehouse_name]: Yup.string().required(""),
  [schema_obj.first_accordion.region]: Yup.string().required(""),
  [schema_obj.first_accordion.state]: Yup.string().required(""),
  [schema_obj.first_accordion.sub_state]: Yup.string().required(""),
  [schema_obj.first_accordion.district]: Yup.string().required(""),
  [schema_obj.first_accordion.area]: Yup.string().required(""),
  [schema_obj.first_accordion.warehouse_address]: Yup.string().required(""),
  [schema_obj.first_accordion.pincode]: Yup.number().required(""),
  [schema_obj.first_accordion.geo_location_of_warehouse]:
    Yup.string() /*.required("")*/,
  [schema_obj.first_accordion.rent]: Yup.number().required(""),
  [schema_obj.first_accordion.total_rent_per_month]: Yup.number().required(""),
  [schema_obj.first_accordion.gg_revenue_ratio]: Yup.number(),
  [schema_obj.first_accordion.warehouse_owned_by]: Yup.string().required(
    "requied the warehouse"
  ),
  [schema_obj.first_accordion.remarks]: Yup.string(),
  [schema_obj.first_accordion.hypothecation_of_warehouse]:
    Yup.string().required("required"),
  [schema_obj.first_accordion.account_name]: Yup.number().when(
    "hypothecation_of_warehouse",
    {
      is: (value) => value === "true",
      then: () => Yup.number().required(""),
      otherwise: () => Yup.number().nullable(),
    }
  ),
  [schema_obj.first_accordion.bank]: Yup.number().when(
    "hypothecation_of_warehouse",
    {
      is: (value) => value === "true",
      then: () => Yup.number().required(""),
      otherwise: () => Yup.number().nullable(),
    }
  ),
  [schema_obj.first_accordion.credit_limit]: Yup.number().when(
    "hypothecation_of_warehouse",
    {
      is: (value) => value === "true",
      then: () => Yup.number().required(""),
      otherwise: () => Yup.number().nullable(),
    }
  ),
  [schema_obj.first_accordion.outstanding]: Yup.number().when(
    "hypothecation_of_warehouse",
    {
      is: (value) => value === "true",
      then: () => Yup.number().required(""),
      otherwise: () => Yup.number().nullable(),
    }
  ),
  [schema_obj.first_accordion.account_health]: Yup.number().when(
    "hypothecation_of_warehouse",
    {
      is: (value) => value === "true",
      then: () => Yup.number().required(""),
      otherwise: () => Yup.number().nullable(),
    }
  ),
  [schema_obj.first_accordion.warehouse_unusable_area]: Yup.number()
    .max(Yup.ref("warehouse_total_area"))
    .required("required"),
  [schema_obj.first_accordion.warehouse_total_area]:
    Yup.number().required("required"),
  [schema_obj.first_accordion.user_capacity]: Yup.number().required("required"),
  [schema_obj.first_accordion.standard_capacity]:
    Yup.number().required("required"),
  [schema_obj.first_accordion.storage_available_area]:
    Yup.number().required("required"),
  [schema_obj.first_accordion.standard_capacity_available_for_storage]:
    Yup.number().required("required"),
  [schema_obj.first_accordion.lock_and_key_of_warehouse]:
    Yup.string().required("required"),
  [schema_obj.first_accordion.distance_between_walls_and_stock]:
    Yup.string().required("required"),
  [schema_obj.first_accordion.no_distance_remarks]: Yup.string(),

  // warehouse sub details second aacordin
  [schema_obj.second_accordion.license_type]: Yup.string().required(),
  [schema_obj.second_accordion.license_number]: Yup.string(),
  [schema_obj.second_accordion.license_start_date]: Yup.string().trim(),
  [schema_obj.second_accordion.license_end_date]: Yup.string()
    .trim()
    .test(
      "is-greater-than-start",
      "End date must be after start date",
      function (value) {
        const { license_start_date } = this.parent;

        // If agreement_start_date is not provided, consider the validation as success
        if (!license_start_date || !value) {
          return true;
        }

        // Compare the dates
        const startDate = new Date(license_start_date);
        const endDate = new Date(value);

        return endDate >= startDate;
      }
    ),
  [schema_obj.second_accordion.wdra_license_number]: Yup.string(),
  [schema_obj.second_accordion.wdra_license_start_date]: Yup.string().trim(),
  [schema_obj.second_accordion.wdra_license_end_date]: Yup.string()
    .trim()
    .test(
      "is-greater-than-start",
      "End date must be after start date",
      function (value) {
        const { wdra_license_start_date } = this.parent;

        // If agreement_start_date is not provided, consider the validation as success
        if (!wdra_license_start_date || !value) {
          return true;
        }

        // Compare the dates
        const startDate = new Date(wdra_license_start_date);
        const endDate = new Date(value);

        return endDate >= startDate;
      }
    ),
  [schema_obj.second_accordion.fssai_license_number]: Yup.string(),
  [schema_obj.second_accordion.fssai_license_start_date]: Yup.string().trim(),
  [schema_obj.second_accordion.fssai_license_end_date]: Yup.string()
    .trim()
    .test(
      "is-greater-than-start",
      "End date must be after start date",
      function (value) {
        const { fssai_license_start_date } = this.parent;

        // If agreement_start_date is not provided, consider the validation as success
        if (!fssai_license_start_date || !value) {
          return true;
        }

        // Compare the dates
        const startDate = new Date(fssai_license_start_date);
        const endDate = new Date(value);

        return endDate >= startDate;
      }
    ),
  [schema_obj.second_accordion.is_factory_premise]: Yup.string().required(""),
  [schema_obj.second_accordion.factory_premise_remarks]: Yup.string(),

  // Commodity Details accordion
  // [schema_obj.fourth_accordion.commodity_type]:
  //   Yup.string().required("required"),
  [schema_obj.fourth_accordion.commodity_insurance]:
    Yup.string().required("required"),
  [schema_obj.fourth_accordion.commodity_inward_type]:
    Yup.string().required("required"),
  [schema_obj.fourth_accordion.expected_commodity]:
    Yup.array().required("required"),
  [schema_obj.fourth_accordion.prestack_commodity]: Yup.number().when(
    "commodity_inward_type",
    {
      is: (value) => value === "PS",
      then: () => Yup.number().required(""),
      otherwise: () => Yup.number().nullable(),
    }
  ),
  [schema_obj.fourth_accordion.no_of_bags]: Yup.number().when(
    "commodity_inward_type",
    {
      is: (value) => value === "PS",
      then: () => Yup.number().required(""),
      otherwise: () => Yup.number().nullable(),
    }
  ),
  [schema_obj.fourth_accordion.weight]: Yup.number().when(
    "commodity_inward_type",
    {
      is: (value) => value === "PS",
      then: () => Yup.number().required(""),
      otherwise: () => Yup.number().nullable(),
    }
  ),
  [schema_obj.fourth_accordion.total_value]: Yup.number().when(
    "commodity_inward_type",
    {
      is: (value) => value === "PS",
      then: () => Yup.number().required(""),
      otherwise: () => Yup.number().nullable(),
    }
  ),
  [schema_obj.fourth_accordion.commodity_inside_wh]:
    Yup.string().required("required"),
  [schema_obj.fourth_accordion.pre_stack_commodity_stack_countable]:
    Yup.string().required("required"),
  [schema_obj.fourth_accordion.pre_stack_commodity_level_of_infestation]:
    Yup.string().required("required"),
  [schema_obj.fourth_accordion.pre_stack_commodity_sample_mandatory]:
    Yup.string().required("required"),
  [schema_obj.fourth_accordion.funded_by_bank]:
    Yup.string().required("required"),
  [schema_obj.fourth_accordion.funded_by_bank_remarks]: Yup.string(),
  [schema_obj.fourth_accordion.gg_access_to_stock_bk]:
    Yup.string().required("required"),

  [schema_obj.fifth_accordion.weightment_facility]:
    Yup.string().required("required"),
  [schema_obj.fifth_accordion.weighbridge_name]: Yup.string().when(
    "weightment_facility",
    {
      is: (value) => value === "true",
      then: () => Yup.string().required(""),
      otherwise: () => Yup.string().nullable(),
    }
  ),
  [schema_obj.fifth_accordion.weighbridge_distance]: Yup.number().when(
    "weightment_facility",
    {
      is: (value) => value === "true",
      then: () => Yup.number().required(""),
      otherwise: () => Yup.number().nullable(),
    }
  ),
  [schema_obj.fifth_accordion.temp_humidity_maintainance]: Yup.string().when(
    "warehouse_unit_type",
    {
      is: (value) => Number(value) === 4,
      then: () => Yup.string().required(""),
      otherwise: () => Yup.string().nullable(),
    }
  ),
  [schema_obj.fifth_accordion.generator_available]: Yup.string().when(
    "warehouse_unit_type",
    {
      is: (value) => Number(value) === 4,
      then: () => Yup.string().required(""),
      otherwise: () => Yup.string().nullable(),
    }
  ),
  [schema_obj.fifth_accordion.insurance_of_plant_machinary]: Yup.string().when(
    "warehouse_unit_type",
    {
      is: (value) => Number(value) === 4,
      then: () => Yup.string().required(""),
      otherwise: () => Yup.string().nullable(),
    }
  ),
  [schema_obj.fifth_accordion.insurance_covers_stk_deter]: Yup.string().when(
    "warehouse_unit_type",
    {
      is: (value) => Number(value) === 4,
      then: () => Yup.string().required(""),
      otherwise: () => Yup.string().nullable(),
    }
  ),

  [schema_obj.gard_accordion.is_new_security_guard_day_shift]: Yup.string(),
  [schema_obj.gard_accordion.is_new_security_guard_night_shift]: Yup.string(),
  [schema_obj.gard_accordion.is_new_supervisor_day_shift]: Yup.string(),
  [schema_obj.gard_accordion.is_new_supervisor_night_shift]: Yup.string(),
  [schema_obj.gard_accordion.security_guard_day_shift]: Yup.string()
    .nullable()
    .test("isRequired", "", function (value) {
      const {
        security_guard_night_shift,
        is_new_security_guard_day_shift,
        is_new_security_guard_night_shift,
      } = this.parent;
      if (
        !(
          security_guard_night_shift ||
          is_new_security_guard_day_shift ||
          is_new_security_guard_night_shift
        ) &&
        !value
      ) {
        return this.createError({
          message: "",
        });
      }

      return true;
    }),
  [schema_obj.gard_accordion.security_guard_night_shift]: Yup.string()
    .nullable()
    .test("isRequired", "", function (value) {
      const {
        security_guard_day_shift,
        is_new_security_guard_day_shift,
        is_new_security_guard_night_shift,
      } = this.parent;
      if (
        !(
          security_guard_day_shift ||
          is_new_security_guard_day_shift ||
          is_new_security_guard_night_shift
        ) &&
        !value
      ) {
        return this.createError({
          message: "",
        });
      }

      return true;
    }),
  [schema_obj.gard_accordion.supervisor_day_shift]: Yup.string()
    .nullable()
    .test("isRequired", "", function (value) {
      const {
        supervisor_night_shift,
        is_new_supervisor_day_shift,
        is_new_supervisor_night_shift,
      } = this.parent;
      if (
        !(
          supervisor_night_shift ||
          is_new_supervisor_day_shift ||
          is_new_supervisor_night_shift
        ) &&
        !value
      ) {
        return this.createError({
          path: "supervisor_day_shift",
          message: "",
        });
      }

      return true;
    }),
  [schema_obj.gard_accordion.supervisor_night_shift]: Yup.string()
    .nullable()
    .test("isRequired", "", function (value) {
      const {
        supervisor_day_shift,
        is_new_supervisor_day_shift,
        is_new_supervisor_night_shift,
      } = this.parent;
      if (
        !(
          supervisor_day_shift ||
          is_new_supervisor_day_shift ||
          is_new_supervisor_night_shift
        ) &&
        !value
      ) {
        return this.createError({
          message: "",
        });
      }

      return true;
    }),

  [schema_obj.other_accordion?.dacroit_prone]: Yup.string().required(),
  [schema_obj.other_accordion?.riots_prone]: Yup.string().required(""),
  [schema_obj.other_accordion?.earthquake_prone]: Yup.string().required(""),
  [schema_obj.other_accordion?.flood_prone]: Yup.string().required(""),
  [schema_obj.other_accordion?.main_center_distance]: Yup.number().required(""),
  [schema_obj.other_accordion?.police_station_distance]:
    Yup.number().required(""),
  [schema_obj.other_accordion?.fire_station_distance]:
    Yup.number().required(""),
  [schema_obj.other_accordion?.mandi_distance]: Yup.number().required(""),
  [schema_obj.other_accordion?.goodshed_distance]: Yup.number().required(""),
  [schema_obj.other_accordion?.fire_extinguishers]: Yup.string(),
  [schema_obj.other_accordion?.fire_extinguisher_count]: Yup.number().when(
    "fire_extinguishers",
    {
      is: (value) => value === "true",
      then: () => Yup.number().required(""),
      otherwise: () => Yup.number().nullable(),
    }
  ),
  [schema_obj.other_accordion?.fire_buckets]: Yup.string(),
  [schema_obj.other_accordion?.fire_bucket_count]: Yup.number().when(
    "fire_buckets",
    {
      is: (value) => value === "true",

      then: () => Yup.number().required(""),
      otherwise: () => Yup.number().nullable(),
    }
  ),
  [schema_obj.other_accordion?.other_equipment]: Yup.string(),
  [schema_obj.other_accordion?.other_equipment_count]: Yup.number().when(
    "other_equipment",
    {
      is: (value) => value === "true",
      then: () => Yup.number().required(""),
      otherwise: () => Yup.number().nullable(),
    }
  ),
  [schema_obj.other_accordion?.other_equipment_remarks]: Yup.string(),
  [schema_obj.other_accordion?.storage_worthy]: Yup.string().required(""),
  [schema_obj.other_accordion?.floor_type]: Yup.string().required(""),
  [schema_obj.other_accordion?.floor_remarks]: Yup.string().when("floor_type", {
    is: (value) => value === "Other",
    then: () => Yup.string().required(""),
    otherwise: () => Yup.string().nullable(),
  }),
  [schema_obj.other_accordion?.shutters]: Yup.string().required(""),
  [schema_obj.other_accordion?.shutter_door_count]:
    Yup.number().required("required"),
  [schema_obj.other_accordion?.roof_type]: Yup.string().required(""),
  [schema_obj.other_accordion?.other_roof_remarks]: Yup.string().when(
    "roof_type",
    {
      is: (value) => value === "Other",
      then: () => Yup.string().required(""),
      otherwise: () => Yup.string().nullable(),
    }
  ),
  [schema_obj.other_accordion?.air_roof_fan_available]:
    Yup.string().required(""),
  [schema_obj.other_accordion?.air_roof_count]: Yup.number().when(
    "air_roof_fan_available",
    {
      is: (value) => value === "true",
      then: () => Yup.number().required(""),
      otherwise: () => Yup.number().nullable(),
    }
  ),
  [schema_obj.other_accordion?.wall_type]: Yup.string().required(),
  [schema_obj.other_accordion?.other_wall_remarks]: Yup.string().when(
    "wall_type",
    {
      is: (value) => value === "Other",
      then: () => Yup.string().required(""),
      otherwise: () => Yup.string().nullable(),
    }
  ),
  [schema_obj.other_accordion?.plinth_height]: Yup.number().required(""),
  [schema_obj.other_accordion?.approach_road_type]: Yup.string().required(),
  [schema_obj.other_accordion?.ventilators]: Yup.string().required(""),
  [schema_obj.other_accordion?.ventilators_count]: Yup.number().when(
    "ventilators",
    {
      is: (value) => value === "true",
      then: () => Yup.number().required(""),
      otherwise: () => Yup.number().nullable(),
    }
  ),
  [schema_obj.other_accordion?.window]: Yup.string().required(""),
  [schema_obj.other_accordion?.window_count]: Yup.number().when("window", {
    is: (value) => value === "true",
    then: () => Yup.number().required(""),
    otherwise: () => Yup.number().nullable(),
  }),
  [schema_obj.other_accordion?.gate]: Yup.string().required(""),
  [schema_obj.other_accordion?.gate_count]: Yup.number().when("gate", {
    is: (value) => value === "true",
    then: () => Yup.number().required(""),
    otherwise: () => Yup.number().nullable(),
  }),
  [schema_obj.other_accordion?.fencing]: Yup.string().required(""),
  [schema_obj.other_accordion?.compoundwall]: Yup.string().required(""),
  [schema_obj.other_accordion?.drainage]: Yup.string().required(""),
  [schema_obj.other_accordion?.water]: Yup.string().required(""),
  [schema_obj.other_accordion?.electricity]: Yup.string().required(""),
  [schema_obj.other_accordion?.live_wires_in_wh]: Yup.string().required(""),
  [schema_obj.other_accordion?.telephone_facility]: Yup.string().required(""),
  [schema_obj.other_accordion?.telephone_no]: Yup.string().when(
    "telephone_facility",
    {
      is: (value) => value === "true",
      then: () => Yup.string().required(""),
      otherwise: () => Yup.string().nullable(),
    }
  ),
  [schema_obj.other_accordion?.dunnage]: Yup.string().required(""),
  [schema_obj.other_accordion?.dunnage_type]: Yup.string().when(
    "telephone_facility",
    {
      is: (value) => value === "true",
      then: () => Yup.string().required(""),
      otherwise: () => Yup.string().nullable(),
    }
  ),
  [schema_obj.other_accordion?.other_dunnage_remarks]: Yup.string().when(
    "dunnage_type",
    {
      is: (value) => value === "Other",
      then: () => Yup.string().required(""),
      otherwise: () => Yup.string().nullable(),
    }
  ),
  [schema_obj.other_accordion?.people_integrity_in_area]:
    Yup.string().required(),
  [schema_obj.other_accordion?.theft_incidence_in_three_years]:
    Yup.string().required(""),
  [schema_obj.other_accordion?.theft_remarks]: Yup.string().when(
    "theft_incidence_in_three_years",
    {
      is: (value) => value === "true",
      then: () => Yup.string().required(""),
      otherWise: () => Yup.string().nullable(),
    }
  ),
  [schema_obj.other_accordion?.damanget_incidence_in_three_years]:
    Yup.string().required(""),
  [schema_obj.other_accordion?.damage_remarks]: Yup.string().when(
    "damanget_incidence_in_three_years",
    {
      is: (value) => value === "true",
      then: () => Yup.string().required(""),
      otherWise: () => Yup.string().nullable(),
    }
  ),
  [schema_obj.other_accordion?.flood_incidence_in_three_years]:
    Yup.string().required(""),
  [schema_obj.other_accordion?.flood_remarks]: Yup.string().when(
    "flood_incidence_in_three_years",
    {
      is: (value) => value === "true",
      then: () => Yup.string().required(""),
      otherWise: () => Yup.string().nullable(),
    }
  ),

  [schema_obj.seventh_accordion.place_of_inspection]: Yup.string().required(""),
  [schema_obj.seventh_accordion.inspection_date]: Yup.string().required(""),
  [schema_obj.seventh_accordion.survey_official]: Yup.string().required(""),
  [schema_obj.seventh_accordion.wh_photos_path]: Yup.array()
    .min(1)
    .required(""),
  [schema_obj.seventh_accordion.warehouse_related_document]: Yup.array()
    .min(1)
    .required(""),
});

// warehouse_owner form method
const warehouse_owner_schema = Yup.object().shape({
  [warehouse_owner_obj.warehouse_owner_name]: Yup.string().required(""),
  [warehouse_owner_obj.warehouse_owner_address]: Yup.string().required(""),
  [warehouse_owner_obj.warehouse_owner_contact_no]: Yup.string().required(""),
  [warehouse_owner_obj.rent_amount]: Yup.string().required(""),
  [warehouse_owner_obj.revenue_sharing_fix_amount]: Yup.string().required(""),
  [warehouse_owner_obj.revenue_sharing_ratio]: Yup.string().required(""),
});

// lessee_details  form method
const lessee_details_obj_schema = Yup.object().shape({
  [lessee_details_obj.lessee_name]: Yup.string().required(""),
  [lessee_details_obj.lessee_address]: Yup.string().required(""),
  [lessee_details_obj.lessee_contact_no]: Yup.string().required(""),
  [lessee_details_obj.rent_amount]: Yup.string().required(""),
  [lessee_details_obj.revenue_sharing_fix_amount]: Yup.string().required(""),
  [lessee_details_obj.revenue_sharing_ratio]: Yup.string().required(""),
});

// Clients details form method
const clients_details_schema = Yup.object().shape({
  [clients_details_obj.client_name]: Yup.string().required(""),
  [clients_details_obj.client_address]: Yup.string().required(""),
});

// Chamber details form method
const chamber_details_schema = Yup.object().shape({
  [chamber_details_obj.chamber_number]: Yup.string().required("required"),
  [chamber_details_obj.chamber_length]: Yup.number().required("required"),
  [chamber_details_obj.chamber_breadth]: Yup.string().required("required"),
  [chamber_details_obj.roof_height]: Yup.number().required("required"),
  [chamber_details_obj.stackble_height]: Yup.number().required("required"),
  [chamber_details_obj.sq_feet]: Yup.number().required("required"),
  [chamber_details_obj.total_area]: Yup.number().required("required"),
});

const oil_tank_details_schema = Yup.object().shape({
  [oil_tank_details_obj.chamber_number]: Yup.string().required("required"),
  [oil_tank_details_obj.diameter]: Yup.number().required("required"),
  [oil_tank_details_obj.height]: Yup.number().required("required"),
  [oil_tank_details_obj.density]: Yup.number().required("required"),
  [oil_tank_details_obj.capacity]: Yup.number().required("required"),
});

const silo_details_schema = Yup.object().shape({
  [silo_details_obj.chamber_number]: Yup.string().required("required"),
  [silo_details_obj.diameter]: Yup.number().required("required"),
  [silo_details_obj.height]: Yup.number().required("required"),
  [silo_details_obj.density]: Yup.number().required("required"),
  [silo_details_obj.capacity]: Yup.number().required("required"),
});

export {
  form_schema,
  warehouse_owner_schema,
  lessee_details_obj_schema,
  clients_details_schema,
  chamber_details_schema,
  oil_tank_details_schema,
  silo_details_schema,
};
