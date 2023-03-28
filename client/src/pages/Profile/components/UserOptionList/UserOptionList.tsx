import { Fragment } from "react";
import UserOption from "../UserOption";
import UserSignOutOption from "../UserSignOutOption";

function UserOptionList() {
  return (
    <Fragment>
      <label htmlFor="userAction">Username ali8eias</label>
      <select name="userInfo">
        <option value="javascript"></option>
        <option value="python"></option>
        <option value="c++"></option>
        <option value="java"></option>
      </select>
    </Fragment>
  );
}

export default UserOptionList;

UserOptionList.Option = UserOption;
UserOptionList.SignOutOption = UserSignOutOption;
