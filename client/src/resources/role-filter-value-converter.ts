export class RoleFilterValueConverter {
  public toView(values, roleId) {
    return values.filter(value => {
      if (!!value.roleId) {
        return value.roleId === roleId;
      }
      return true;
    });
  }
}
