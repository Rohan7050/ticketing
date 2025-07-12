import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  console.log("APP COMPONENT!", currentUser);
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className='container'>
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  let userData;
  try {
    const data = await client.get("/api/users/currentuser");
    console.log(data);
    if (!data.data) data = null;
    else userData = data.data.currentUser;
  } catch (error) {
    userData = null;
  }
  console.log(userData);
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, userData);
  }

  return {
    pageProps,
    currentUser: userData,
  };
};

export default AppComponent;
