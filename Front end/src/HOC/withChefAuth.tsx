const withChefAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const userId = sessionStorage.getItem("userId");
    const userRole = JSON.parse(sessionStorage.getItem("userRole") || '""');

    if (!userId) {
      window.location.replace("/login");
      return null;
    }

    if (userRole !== "Chef") {
      window.location.replace("/unauthorized");
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withChefAuth;
