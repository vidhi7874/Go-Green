const schema_obj = {
  first_accordion: {
    hiring_proposal: "hiring_proposal", //done
    warehouse_type: "warehouse_type", //done
    warehouse_sub_type: "warehouse_sub_type", //done
    warehouse_unit_type: "warehouse_unit_type", //done
    warehouse_name: "warehouse_name", //done
    region: "region", //done
    state: "state", //done
    sub_state: "sub_state", //done
    district: "district", //done
    area: "area", //done
    warehouse_address: "warehouse_address", //done
    pincode: "warehouse_pincode", //done
    geo_location_of_warehouse: "geo_location_of_warehouse", //done
    rent: "rent",
    total_rent_per_month: "total_rent_per_month", //done
    gg_revenue_ratio: "gg_revenue_ratio",
    warehouse_owned_by: "warehouse_owned_by", //done
    remarks: "remarks", //done
    hypothecation_of_warehouse: "hypothecation_of_warehouse", //done
    account_name: "account_name", //done
    bank: "bank", //done
    credit_limit: "credit_limit", //done
    outstanding: "outstanding", //done
    account_health: "account_health", //done

    warehouse_unusable_area: "warehouse_unusable_area", //done
    warehouse_total_area: "warehouse_total_area", //done
    user_capacity: "user_capacity", //done
    standard_capacity: "standard_capacity", //done
    storage_available_area: "storage_available_area", //done

    standard_capacity_available_for_storage:
      "standard_capacity_available_for_storage", //done
    lock_and_key_of_warehouse: "lock_and_key_of_warehouse", //done
    distance_between_walls_and_stock: "distance_between_walls_and_stock", //done
    no_distance_remarks: "no_distance_remarks", //done
  },

  second_accordion: {
    license_type: "license_type", //done
    license_number: "license_number", //done
    license_start_date: "license_start_date", //done
    license_end_date: "license_end_date", //done
    wdra_license_number: "wdra_license_number", //done
    wdra_license_start_date: "wdra_license_start_date", //done
    wdra_license_end_date: "wdra_license_end_date", //done
    fssai_license_number: "fssai_license_number", //done
    fssai_license_start_date: "fssai_license_start_date", //done
    fssai_license_end_date: "fssai_license_end_date", //done
    mandi_license_number: "mandi_license_number", //done
    mandi_license_start_date: "mandi_license_start_date", //done
    mandi_license_end_date: "mandi_license_end_date", //done
    // physical_structure_warehouse_details_form_schema
  },

  fourth_accordion: {
    commodity_type: "commodity_type", //done
    commodity_insurance: "commodity_insurance", //done
    commodity_inward_type: "commodity_inward_type", //done
    expected_commodity: "expected_commodity",
    prestack_commodity: "prestack_commodity",
    no_of_bags: "no_of_bags",
    weight: "weight",
    total_value: "total_value",
    pre_funded_flag: "pre_funded_flag",
    pre_funded_bank: "pre_funded_bank",
    pre_funded_branch: "pre_funded_branch",
  },

  fifth_accordion: {
    weightment_facility: "weightment_facility", //done
    weighbridge_name: "weighbridge_name", //done
    weighbridge_distance: "weighbridge_distance", //done
    weighbridge_type: "weighbridge_type", //done
    temp_humidity_maintainance: "temp_humidity_maintainance", //done
    generator_available: "generator_available", //done
  },

  gard_accordion: {
    supervisor_day_shift: "supervisor_day_shift", //done
    supervisor_night_shift: "supervisor_night_shift", //done
    security_guard_day_shift: "security_guard_day_shift", //done
    security_guard_night_shift: "security_guard_night_shift", //done
    is_new_supervisor_day_shift: "is_new_supervisor_day_shift", //done
    is_new_supervisor_night_shift: "is_new_supervisor_night_shift", //done
    is_new_security_guard_day_shift: "is_new_security_guard_day_shift", //done
    is_new_security_guard_night_shift: "is_new_security_guard_night_shift", //done
  },

  other_accordion: {
    factory_premises: "factory_premises",
    port_premises: "port_premises",
    wh_clean: "wh_clean",
    rodent_in_wh: "rodent_in_wh",
    infestation_in_wh: "infestation_in_wh",
    fire_fight_available: "fire_fight_available",
    fire_extinguisher_count: "fire_extinguisher_count",
    expiry_date_equipment: "expiry_date_equipment",
    police_station_distance: "police_station_distance", //done
    police_address: "police_address",
    police_contact_no: "police_contact_no",
    fire_station_distance: "fire_station_distance", //done
    fire_address: "fire_address",
    fire_contact_no: "fire_contact_no",
    godown_structure: "godown_structure",
    kaccha_risk: "kaccha_risk",
    mandi_distance: "mandi_distance", //done
    goodshed_distance: "goodshed_distance", //done
    fire_buckets: "fire_buckets", //for personal
    fire_bucket_count: "fire_bucket_count", //done
    other_equipment: "other_equipment", //for personal
    other_equipment_count: "other_equipment_count", //done
    other_equipment_remarks: "other_equipment_remarks",
    storage_worthy: "storage_worthy", // done
    floor_type: "floor_type", // done
    floor_remarks: "floor_remarks",
    shutters: "shutters", // done
    shutter_door_count: "shutter_door_count", // done
    roof_type: "roof_type", // done
    other_roof_remarks: "other_roof_remarks",
    air_roof_fan_available: "air_roof_fan_available", // for personal
    air_roof_count: "air_roof_count", // done
    wall_type: "wall_type", // done
    other_wall_remarks: "other_wall_remarks",
    plinth_height: "plinth_height", // done
    approach_road_type: "approach_road_type", // done
    ventilators: "ventilators", // for personal
    ventilators_count: "ventilators_count", // done
    window: "window", // for personal
    window_count: "window_count", // done
    gate: "gate", // for personal
    gate_count: "gate_count", // done
    fencing: "fencing", // done
    compoundwall: "compoundwall", // done
    drainage: "drainage", // done
    water: "water", // done
    electricity: "electricity", // done
    live_wires_in_wh: "live_wires_in_wh", // done
    telephone_facility: "telephone_facility", // done
    telephone_no: "telephone_no", // done
    dunnage: "dunnage", // for personal
    dunnage_type: "dunnage_type", // done
    other_dunnage_remarks: "other_dunnage_remarks",
    people_integrity_in_area: "people_integrity_in_area", //done
    theft_incidence_in_three_years: "theft_incidence_in_three_years", //done
    theft_remarks: "theft_remarks", //done
    damanget_incidence_in_three_years: "damanget_incidence_in_three_years", //done
    damage_remarks: "damage_remarks", //done
    flood_incidence_in_three_years: "flood_incidence_in_three_years", //done
    flood_remarks: "flood_remarks", //done
  },

  seventh_accordion: {
    place_of_inspection: "place_of_inspection", //done
    inspection_date: "inspection_date", //done
    survey_official: "survey_official",
    wh_photos_path: "wh_photos_path",
    warehouse_related_document: "warehouse_related_document",
  },
};

const warehouse_owner_obj = {
  warehouse_owner_name: "warehouse_owner_name",
  warehouse_owner_address: "warehouse_owner_address",
  warehouse_owner_contact_no: "warehouse_owner_contact_no",
  rent_amount: "rent_amount",
  revenue_sharing_fix_amount: "revenue_sharing_fix_amount",
  revenue_sharing_ratio: "revenue_sharing_ratio",
};

const lessee_details_obj = {
  lessee_name: "lessee_name",
  lessee_address: "lessee_address",
  lessee_contact_no: "lessee_contact_no",
  rent_amount: "rent_amount",
  revenue_sharing_fix_amount: "revenue_sharing_fix_amount",
  revenue_sharing_ratio: "revenue_sharing_ratio",
};

const clients_details_obj = {
  client_name: "client_name",
  client_address: "client_address",
};

const chamber_details_obj = {
  chamber_number: "chamber_number",
  chamber_length: "chamber_length",
  chamber_breadth: "chamber_breadth",
  roof_height: "roof_height",
  stackble_height: "stackble_height",
  sq_feet: "sq_feet",
  total_area: "total_area",
};

const oil_tank_details_obj = {
  chamber_number: "chamber_number",
  diameter: "diameter",
  height: "height",
  density: "density",
  capacity: "capacity",
};

const silo_details_obj = {
  chamber_number: "chamber_number",
  diameter: "diameter",
  height: "height",
  density: "density",
  capacity: "capacity",
};

export {
  schema_obj,
  warehouse_owner_obj,
  lessee_details_obj,
  clients_details_obj,
  chamber_details_obj,
  oil_tank_details_obj,
  silo_details_obj,
};
