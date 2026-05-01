import '../styles/globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useContext } from 'react';

// internal import
import { ChatAppProvider, ChatAppContext } from "../Context/ChatAppContext";
import { NavBar } from "../Components/index";
import OnboardingModal from "../Components/Onboarding/OnboardingModal";

function AppWrapper({ Component, pageProps }) {
  const {
    contract,
    account,
    connectWallet,
    createAccount,
  } = useContext(ChatAppContext);

  return (
    <div>
      <NavBar />
      <OnboardingModal
        contract={contract}
        account={account}
        connectWallet={connectWallet}
        createAccount={createAccount}
      />
      <Component {...pageProps} />
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}

export default function MyApp(props) {
  return (
    <ChatAppProvider>
      <AppWrapper {...props} />
    </ChatAppProvider>
  );
}