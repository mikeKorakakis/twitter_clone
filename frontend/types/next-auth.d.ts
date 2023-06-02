import { User } from "next-auth"
import { JWT } from "next-auth/jwt"

type UserId = string

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: UserId
    }
  }
}
// sk_test_51MT07bDhcfllogi9YQOsCpHOwzHH5yHYEAlIB2oIg2TBjNbtL12YGE5XOWoAysU1TjblrvkjJ9Pv0J3HCMtliOJt00tOwFcPrR
// 
// prod_O0UB007OfrzJh6