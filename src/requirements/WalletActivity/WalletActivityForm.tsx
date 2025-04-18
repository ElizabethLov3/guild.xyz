import { FormControl, FormLabel, Stack } from "@chakra-ui/react"
import { consts } from "@guildxyz/types"
import ControlledSelect from "components/common/ControlledSelect"
import FormErrorMessage from "components/common/FormErrorMessage"
import { useFormContext, useWatch } from "react-hook-form"
import ChainPicker from "requirements/common/ChainPicker"
import { PROVIDER_TYPES } from "requirements/requirementProvidedValues"
import { RequirementFormProps, RequirementType } from "requirements/types"
import { SelectOption } from "types"
import parseFromObject from "utils/parseFromObject"
import CovalentContractCallCount from "./components/CovalentContractCallCount"
import CovalentContractCallCountRelative from "./components/CovalentContractCallCountRelative"
import CovalentContractDeploy from "./components/CovalentContractDeploy"
import CovalentContractDeployRelative from "./components/CovalentContractDeployRelative"
import CovalentFirstTx from "./components/CovalentFirstTx"
import CovalentFirstTxRelative from "./components/CovalentFirstTxRelative"
import CovalentTxCount from "./components/CovalentTxCount"
import CovalentTxCountRelative from "./components/CovalentTxCountRelative"

const walletActivityRequirementTypes: SelectOption[] = [
  {
    label: "First transaction",
    value: "COVALENT_FIRST_TX",
    WalletActivityRequirement: CovalentFirstTx,
  },
  {
    label: "First transaction (relative)",
    value: "COVALENT_FIRST_TX_RELATIVE",
    WalletActivityRequirement: CovalentFirstTxRelative,
  },
  {
    label: "Deployed a contract",
    value: "COVALENT_CONTRACT_DEPLOY",
    WalletActivityRequirement: CovalentContractDeploy,
  },
  {
    label: "Deployed a contract (relative)",
    value: "COVALENT_CONTRACT_DEPLOY_RELATIVE",
    WalletActivityRequirement: CovalentContractDeployRelative,
  },
  {
    label: "Transactions",
    value: "COVALENT_TX_COUNT",
    WalletActivityRequirement: CovalentTxCount,
  },
  {
    label: "Transactions (relative)",
    value: "COVALENT_TX_COUNT_RELATIVE",
    WalletActivityRequirement: CovalentTxCountRelative,
  },
  {
    label: "Called a contract method",
    value: "COVALENT_CONTRACT_CALL_COUNT",
    WalletActivityRequirement: CovalentContractCallCount,
  },
  {
    label: "Called a contract method (relative)",
    value: "COVALENT_CONTRACT_CALL_COUNT_RELATIVE",
    WalletActivityRequirement: CovalentContractCallCountRelative,
  },
]

const WalletActivityForm = ({
  baseFieldPath,
  field,
  providerTypesOnly,
}: RequirementFormProps): JSX.Element => {
  const {
    resetField,
    formState: { errors },
  } = useFormContext()

  const type = useWatch({ name: `${baseFieldPath}.type` })
  const isEditMode = !!field?.id

  const supportedRequirementTypes = walletActivityRequirementTypes

  const selected = supportedRequirementTypes.find(
    (reqType) => reqType.value === type
  )

  const resetFields = () => {
    resetField(`${baseFieldPath}.address`, { defaultValue: "" })
    resetField(`${baseFieldPath}.data.txValue`, { defaultValue: "" })

    resetField(`${baseFieldPath}.data.method`, {
      defaultValue: "",
    })
    resetField(`${baseFieldPath}.data.inputs`, {
      defaultValue: [],
    })
    resetField(`${baseFieldPath}.data.txCount`, {
      defaultValue: 1,
    })
    resetField(`${baseFieldPath}.data.timestamps`, {
      defaultValue: {},
    })
  }

  const options = walletActivityRequirementTypes.filter((el) =>
    providerTypesOnly ? PROVIDER_TYPES.includes(el.value as RequirementType) : true
  )

  return (
    <Stack spacing={4} alignItems="start">
      <FormControl
        isInvalid={!!parseFromObject(errors, baseFieldPath)?.type?.message}
      >
        <FormLabel>Type</FormLabel>

        <ControlledSelect
          name={`${baseFieldPath}.type`}
          rules={{ required: "It's required to select a type" }}
          options={options}
          beforeOnChange={resetFields}
          isDisabled={isEditMode}
        />

        <FormErrorMessage>
          {parseFromObject(errors, baseFieldPath)?.type?.message}
        </FormErrorMessage>
      </FormControl>

      {selected && (
        <>
          <ChainPicker
            controlName={`${baseFieldPath}.chain`}
            supportedChains={
              // We only support some chains with these two requirement types
              selected.value.startsWith("COVALENT_CONTRACT_CALL_COUNT")
                ? ["INK", "INK_SEPOLIA", "SONIC"]
                : consts.WALLET_ACTIVITY_CHAINS
            }
          />

          {selected?.WalletActivityRequirement && (
            <selected.WalletActivityRequirement baseFieldPath={baseFieldPath} />
          )}
        </>
      )}
    </Stack>
  )
}

export default WalletActivityForm
