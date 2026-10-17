import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "components/ActionButton";
import DividedField from "components/Forms/DividedField";
import AuthBox from "containers/AuthBox";
import AuthContainer from "containers/AuthContainer";
import { useQueryParams } from "hooks/useQueryParams";
import siteMap from "routes/siteMap";
import { CODE_LENGTH } from "validators/auth";

const ConfirmCode = () => {
  const [code, setCode] = useState<string[]>([]);
  const queryParams = useQueryParams();
  const navigate = useNavigate();
  const { email = "" } = queryParams.get();
  const isComplete = code.join("").length === CODE_LENGTH;

  const onHandleSubmit = () => {
    if (!isComplete) {
      return;
    }
    queryParams.navigate(siteMap.auth.newPassword, {
      email,
      code: code.join(""),
    });
  };

  const onHandleCancel = () => {
    navigate(siteMap.auth.requestNewPassword);
  };

  return (
    <AuthContainer>
      <AuthBox
        title="Confirmar código"
        subtitle={`Informe o código de ${CODE_LENGTH} dígitos que enviamos para o email ${
          email || "-"
        }`}
        width="30rem"
        onSubmit={onHandleSubmit}
        actions={
          <ActionButton
            rejectMsg="Cancelar"
            resolveMsg="Confirmar"
            resolveType="submit"
            resolveDisabled={!isComplete}
            onReject={onHandleCancel}
          />
        }
      >
        <DividedField size={CODE_LENGTH} onChange={setCode} />
      </AuthBox>
    </AuthContainer>
  );
};

export default ConfirmCode;
