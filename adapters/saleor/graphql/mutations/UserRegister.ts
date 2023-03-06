import { gql } from "@apollo/client";
import { USER_DETAILS_FRAGMENT } from "@/fragments/user";
import { ADDRESS_DETAILS_FRAGMENT } from "@/fragments/address";

export const USER_REGISTER_MUTATION = gql`
  ${USER_DETAILS_FRAGMENT}
  ${ADDRESS_DETAILS_FRAGMENT}
  mutation UserRegisterMutation($input: AccountRegisterInput!) {
    accountRegister(input: $input) {
      accountErrors {
        code
        field
        message
      }
      user {
        ...UserDetails
        isActive
        addresses {
          ...AddressDetails
        }
      }
      requiresConfirmation
    }
  }
`;
