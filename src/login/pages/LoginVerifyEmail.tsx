import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import "../styles/email.css";


export default function LoginVerifyEmail(props: PageProps<Extract<KcContext, { pageId: "login-verify-email.ftl" }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

  const { msg } = i18n;

  const { url, user } = kcContext;

  const infoNode = (
    <p className="instruction infoNode">
      {msg("emailVerifyInstruction2")}
      <br />
      <a href={url.loginAction}>{msg("doClickHere")}</a>
      &nbsp;{msg("emailVerifyInstruction3")}
    </p>
  );

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayInfo
      headerNode={msg("emailVerifyTitle")}
      infoNode={infoNode}
    >
      <p className="instruction">{msg("emailVerifyInstruction1", user?.email ?? "")}</p>
    </Template>
  );
}
