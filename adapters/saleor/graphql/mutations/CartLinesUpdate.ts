import { gql } from "@apollo/client";
import { CHECKOUT_DETAILS_FRAGMENT } from "@/fragments/checkout";

// only updates the lines included in the list
export const CART_LINES_UPDATE_MUTATION = gql`
  ${CHECKOUT_DETAILS_FRAGMENT}
  mutation CartLinesUpdateMutation($checkoutId: ID!, $checkoutLines: [CheckoutLineInput]!) {
    checkoutLinesUpdate(checkoutId: $checkoutId, lines: $checkoutLines) {
      checkoutErrors {
        code
        field
        message
      }
      checkout {
        ...CheckoutDetails
        lines {
          id
          quantity
        }
      }
    }
  }
`;
