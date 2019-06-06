// @flow

import React, { PureComponent } from 'react'
import Box from 'components/base/Box'
import { colors } from 'styles/theme'
import type { Account, TokenAccount } from '@ledgerhq/live-common/lib/types/account'
import styled from 'styled-components'
import CryptoCurrencyIcon from '../../CryptoCurrencyIcon'
import Ellipsis from '../../base/Ellipsis'

type Props = {
  account: Account | TokenAccount,
  name: string,
}

// NB Inside Head to not break alignment with parent row;
const NestedIndicator = styled.div`
  border-left: 1px solid ${p => p.theme.colors.lightFog};
  min-height: 40px;
  height: 100%;
  margin-left: 9px;
  padding-left: 5px;
`

class Header extends PureComponent<Props> {
  render() {
    const { account, name } = this.props
    let currency
    let color
    let title

    if (account.type === 'Account') {
      currency = account.currency
      color = currency.color
      title = currency.name
    } else {
      currency = account.token
      color = colors.grey
      title = 'token'
    }
    return (
      <Box horizontal ff="Open Sans|SemiBold" flow={3} flex="30%" pr={1} alignItems="center">
        {account.type !== 'Account' && <NestedIndicator />}
        <Box alignItems="center" justifyContent="center" style={{ color }}>
          <CryptoCurrencyIcon currency={currency} size={20} />
        </Box>
        <Box grow>
          <Box style={{ textTransform: 'uppercase' }} fontSize={9} color="grey">
            {title}
          </Box>
          <Ellipsis fontSize={12} color="dark">
            {name}
          </Ellipsis>
        </Box>
      </Box>
    )
  }
}

export default Header
