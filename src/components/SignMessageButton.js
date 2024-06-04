import React from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';

const SignMessageButton = () => {
  const { primaryWallet } = useDynamicContext();

  const signMessage = async () => {
    if (!primaryWallet) return;

    const signature = await primaryWallet.connector.signMessage('example');

    console.log('signature', signature);
  };

  return <button onClick={signMessage}>Sign message</button>;
};

export default SignMessageButton;
