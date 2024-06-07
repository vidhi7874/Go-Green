import * as yup from "yup";

export const lot_details_schema = {
  stack_number: "stack_number",
  lot_no: "lot_no",
  average_bag_size: "average_bag_size",
  remaining_bag_for_do: "remaining_bag_for_do",
  remaining_mt_for_do: "remaining_mt_for_do",
  currently_removing_bag: "currently_removing_bag",
  currently_removing_mt: "currently_removing_mt",
  deposited_cir_bag: "deposited_cir_bag",
  deposited_cir_mt: "deposited_cir_mt",
  delivered_cor_bags: "delivered_cor_bags",
  delivered_cor_mt: "delivered_cor_mt",
  do_generated_bag: "do_generated_bag",
  do_generated_mt: "do_generated_mt",
  remaining_do_bags: "remaining_do_bags",
  remaining_do_mt: "remaining_do_mt",
  stack_number_id: "stack_number_id", // special field ....
};

// wrapping the dynamic key to the schema
const lotDetailsValidationSchema = yup.object().shape({
  [lot_details_schema.stack_number]: yup
    .number()
    .typeError("")
    .required(() => null),
  [lot_details_schema.lot_no]: yup
    .object()
    .shape({
      label: yup.string().required(() => null),
      value: yup.string().required(() => null),
    })
    .required(() => null),
  [lot_details_schema.average_bag_size]: yup.string().required(() => null),
  [lot_details_schema.remaining_bag_for_do]: yup.string().required(() => null),
  [lot_details_schema.remaining_mt_for_do]: yup.string().required(() => null),
  [lot_details_schema.currently_removing_bag]: yup
    .number()
    .required(() => null)
    .typeError("")
    .positive("Unit must be greater than 0")
    .test(
      "is-less-than-or-equal",
      "Currently Removing Bag must be smaller or equal to Remaining Bag for DO",
      function (value) {
        const { remaining_bag_for_do } = this.parent;

        if (!value || !remaining_bag_for_do) {
          // If either value is not present, let the other validations handle it
          return true;
        }

        // Convert the values to numbers and compare
        const currentValue = Number(value);
        const remainingValue = Number(remaining_bag_for_do);

        return currentValue <= remainingValue;
      }
    ),
  [lot_details_schema.currently_removing_mt]: yup.string().required(() => null),
  // other keys
  [lot_details_schema.deposited_cir_bag]: yup.string(),
  [lot_details_schema.deposited_cir_mt]: yup.string(),
  [lot_details_schema.delivered_cor_bags]: yup.string(),
  [lot_details_schema.delivered_cor_mt]: yup.string(),
  [lot_details_schema.do_generated_bag]: yup.string(),
  [lot_details_schema.do_generated_mt]: yup.string(),
  [lot_details_schema.remaining_do_bags]: yup.string(),
  [lot_details_schema.remaining_do_mt]: yup.string(),
  [lot_details_schema.stack_number_id]: yup.string(),
});

export default lotDetailsValidationSchema;
