import React, { useCallback, useMemo } from "react";
import { Trans } from "react-i18next";
import { Account, AccountLike, CexDepositEntryPointsLocationsDesktop, isSandbox } from "@ledgerhq/types-live";
import { TokenCurrency, CryptoCurrency, CryptoOrTokenCurrency } from "@ledgerhq/types-cryptoassets";
import {
  getAccountCurrency,
  getMainAccount,
  getReceiveFlowError,
} from "@ledgerhq/live-common/account/index";
import {
  listTokensForCryptoCurrency,
  listTokenTypesForCryptoCurrency,
} from "@ledgerhq/live-common/currencies/index";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Label from "~/renderer/components/Label";
import Button from "~/renderer/components/Button";
import SelectAccount from "~/renderer/components/SelectAccount";
import SelectCurrency from "~/renderer/components/SelectCurrency";
import CurrencyDownStatusAlert from "~/renderer/components/CurrencyDownStatusAlert";
import ErrorBanner from "~/renderer/components/ErrorBanner";
import Alert from "~/renderer/components/Alert";
import { StepProps } from "../Body";
import { supportLinkByTokenType } from "~/config/urls";
import { DepositFromCoinbaseButton } from "~/renderer/modals/Receive/steps/DepositFromCoinbaseButton";

type OnChangeAccount = (account?: AccountLike | null, tokenAccount?: Account | null) => void;
const AccountSelection = ({
  onChangeAccount,
  account,
}: {
  onChangeAccount: OnChangeAccount;
  account: AccountLike | undefined | null;
}) => (
  <>
    <Label>
      <Trans i18nKey="receive.steps.chooseAccount.label" />
    </Label>
    <SelectAccount autoFocus withSubAccounts onChange={onChangeAccount} value={account} />
  </>
);
const TokenParentSelection = ({
  onChangeAccount,
  mainAccount,
}: {
  onChangeAccount: OnChangeAccount;
  mainAccount: Account;
}) => {
  const filterAccountSelect = useCallback(
    a => getAccountCurrency(a) === mainAccount.currency,
    [mainAccount],
  );
  return (
    <>
      <Label>
        <Trans
          i18nKey="receive.steps.chooseAccount.parentAccount"
          values={{
            currencyName: mainAccount.currency.name,
          }}
        />
      </Label>
      <SelectAccount filter={filterAccountSelect} onChange={onChangeAccount} value={mainAccount} />
    </>
  );
};
const TokenSelection = ({
  currency,
  token,
  onChangeToken,
}: {
  currency: CryptoCurrency;
  token: TokenCurrency | undefined | null;
  onChangeToken: (token?: TokenCurrency | null) => void;
}) => {
  const tokens = useMemo(() => listTokensForCryptoCurrency(currency), [currency]);
  return (
    <>
      <Label mt={30}>
        <Trans i18nKey="receive.steps.chooseAccount.token" />
      </Label>
      <SelectCurrency
        onChange={onChangeToken as (token?: CryptoOrTokenCurrency | null) => void}
        currencies={tokens}
        value={token}
      />
    </>
  );
};
export default function StepAccount({
  token,
  account,
  parentAccount,
  receiveTokenMode,
  onChangeAccount,
  onChangeToken,
  eventType,
}: StepProps) {
  const mainAccount = account ? getMainAccount(account, parentAccount) : null;
  const error = account ? getReceiveFlowError(account, parentAccount) : null;
  const tokenTypes = mainAccount ? listTokenTypesForCryptoCurrency(mainAccount.currency) : [];

  // Nb in the context of LL-6449 (nft integration) simplified the wording for the warning.
  const tokenType =
    mainAccount?.currency.name === "Ethereum"
      ? mainAccount.currency.name
      : tokenTypes.map(tt => tt.toUpperCase()).join("/");
  const url = supportLinkByTokenType[tokenTypes[0] as keyof typeof supportLinkByTokenType];
  return (
    <Box flow={1}>
      <TrackPage category={`Receive Flow${eventType ? ` (${eventType})` : ""}`} name="Step 1" />
      {mainAccount ? <CurrencyDownStatusAlert currencies={[mainAccount.currency]} /> : null}
      {error ? <ErrorBanner error={error} /> : null}
      {receiveTokenMode && mainAccount ? (
        <TokenParentSelection mainAccount={mainAccount} onChangeAccount={onChangeAccount} />
      ) : (
        <AccountSelection account={account} onChangeAccount={onChangeAccount} />
      )}
      {receiveTokenMode && mainAccount ? (
        <TokenSelection
          currency={mainAccount.currency}
          token={token}
          onChangeToken={onChangeToken}
        />
      ) : null}

      <DepositFromCoinbaseButton
        location={CexDepositEntryPointsLocationsDesktop.selectCrypto}
        source="Choose a crypto to secure"
      />

      {account && !receiveTokenMode && tokenTypes.length ? (
        <div>
          <Alert type="warning" learnMoreUrl={url} mt={3}>
            <Trans
              i18nKey={`receive.steps.chooseAccount.${
                account.type === "TokenAccount" ? "verifyTokenType" : "warningTokenType"
              }`}
              values={
                account.type === "TokenAccount"
                  ? {
                      token: account.token.name,
                      tokenType,
                      currency: mainAccount && mainAccount.currency.name,
                    }
                  : {
                      ticker: account.currency.ticker,
                      tokenType,
                      currency: account.currency.name,
                    }
              }
            >
              <b></b>
            </Trans>
          </Alert>
        </div>
      ) : null}
    </Box>
  );
}
export function StepAccountFooter({
  transitionTo,
  receiveTokenMode,
  token,
  account,
  parentAccount,
}: StepProps) {
  const error = account ? getReceiveFlowError(account, parentAccount) : null;
  return (
    <Button
      data-test-id="modal-continue-button"
      disabled={!account || (receiveTokenMode && !token) || !!error}
      primary
      onClick={() => isSandbox(account) ? transitionTo("receive") : transitionTo("device")}
    >
      <Trans i18nKey="common.continue" />
    </Button>
  );
}
