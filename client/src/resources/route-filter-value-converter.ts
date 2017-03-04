export class RouteFilterValueConverter {
  public toView(routes, currentUser) {
    return routes.filter(route => {
      let authRoleId = route.settings.authRoleId;
      let userRole = currentUser ? currentUser.role : null;
      if (!!authRoleId) {
        if (!userRole) {
          return false;
        }
        return authRoleId === userRole;
      }
      return true;
    });
  }
}
