import { useContext } from "react"
import { Button, ButtonGroup, useDisclosure } from "@chakra-ui/react"
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core"
import { LinkBreak, SignIn, Wallet } from "phosphor-react"
import shortenHex from "utils/shortenHex"
import { Web3Connection } from "components/web3Connection/Web3ConnectionManager"
import { Token } from "temporaryData/types"
import useBalance from "./hooks/useBalance"
import useENSName from "./hooks/useENSName"
import AccountModal from "../AccountModal"

type Props = {
  token: Token
}

const Account = ({ token }: Props): JSX.Element => {
  const { error, account } = useWeb3React()
  const { openModal, triedEager } = useContext(Web3Connection)
  const ENSName = useENSName(account)
  const { isOpen, onOpen, onClose } = useDisclosure()

  if (typeof window === "undefined") {
    return <Button isLoading>Connect to a wallet</Button>
  }
  if (error instanceof UnsupportedChainIdError) {
    return (
      <Button onClick={openModal} leftIcon={<LinkBreak />} colorScheme="red">
        Wrong Network
      </Button>
    )
  }
  if (typeof account !== "string") {
    return (
      <Button isLoading={!triedEager} onClick={openModal} leftIcon={<SignIn />}>
        Connect to a wallet
      </Button>
    )
  }
  return (
    <>
      <ButtonGroup isAttached variant="outline">
        {token && <Balance token={token} />}
        <Button leftIcon={<Wallet />} onClick={onOpen}>
          {ENSName || `${shortenHex(account, 4)}`}
        </Button>
      </ButtonGroup>
      <AccountModal {...{ isOpen, onClose }} />
    </>
  )
}

const Balance = ({ token }: Props): JSX.Element => {
  const { data: balance } = useBalance(token)

  return <Button mr="-px">{`${balance} ${token.name}`}</Button>
}

export default Account
