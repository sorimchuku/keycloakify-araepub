import type { JSX } from "keycloakify/tools/JSX";
import { useState, useLayoutEffect, useMemo } from "react";
import type { LazyOrNot } from "keycloakify/tools/LazyOrNot";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import { clsx } from "keycloakify/tools/clsx";
import type { UserProfileFormFieldsProps } from "keycloakify/login/UserProfileFormFieldsProps";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import "../styles/register.css";

type RegisterProps = PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n> & {
    UserProfileFormFields: LazyOrNot<(props: UserProfileFormFieldsProps) => JSX.Element>;
    doMakeUserConfirmPassword: boolean;
};

export default function Register(props: RegisterProps) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes, UserProfileFormFields, doMakeUserConfirmPassword } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { messageHeader, url, messagesPerField, recaptchaRequired, recaptchaVisible, recaptchaSiteKey, recaptchaAction, termsAcceptanceRequired } =
        kcContext;

    const { msg, msgStr, advancedMsg } = i18n;

    const [isRequiredFormSubmittable, setIsRequiredFormSubmittable] = useState(false);
    const [isOptionalFormSubmittable, setIsOptionalFormSubmittable] = useState(true);
    const [areTermsAccepted, setAreTermsAccepted] = useState(false);
    const [isOptionalFieldsVisible, setIsOptionalFieldsVisible] = useState(false);
    const [isOptionalFieldsHasValue, setIsOptionalFieldsHasValue] = useState(false);

    useLayoutEffect(() => {
        (window as any)["onSubmitRecaptcha"] = () => {
            // @ts-expect-error
            document.getElementById("kc-register-form").requestSubmit();  
        };

        return () => {
            delete (window as any)["onSubmitRecaptcha"]; 
        };
    }, []);

    const { profile } = kcContext;

    const { requiredKcContext, optionalKcContext, optionalAttributesCount } = useMemo(() => {
        const attributesByName = (profile as any)?.attributesByName ?? {};

        // attributesByName을 직접 순회하여 필수/선택 그룹으로 분리 
        const requiredAttributesByName: any = {};
        const optionalAttributesByName: any = {};

        Object.entries(attributesByName).forEach(([name, attr]: [string, any]) => {
            if (attr.required) {
                requiredAttributesByName[name] = { ...attr, name };
            } else {
                optionalAttributesByName[name] = { ...attr, name };
            }
        });

        const optionalAttributesCount = Object.keys(optionalAttributesByName).length;

        const requiredKcContext = {  
            ...kcContext,
            profile: {
                ...profile,
                attributes: Object.values(requiredAttributesByName),
                attributesByName: requiredAttributesByName
            }
        } as typeof kcContext;

        const optionalKcContext = {  
            ...kcContext,
            profile: {
                ...profile,
                attributes: Object.values(optionalAttributesByName),
                attributesByName: optionalAttributesByName
            }
        } as typeof kcContext;

        return { requiredKcContext, optionalKcContext, optionalAttributesCount };
    }, [kcContext, profile]);

    const onOptionalFieldsChange = () => {
        const attributesByName = (optionalKcContext.profile as any)?.attributesByName ?? {};
        let hasValue = false;

        for (const name of Object.keys(attributesByName)) {
            const elements = document.getElementsByName(name);
            if (elements.length > 0) {
                const element = elements[0] as HTMLInputElement;
                if (element.name === "locale") {
                    continue; // locale 필드는 무시
                } else if (element.type === "checkbox" || element.type === "radio") {
                    for (let i = 0; i < elements.length; i++) {
                        if ((elements[i] as HTMLInputElement).checked) {
                            hasValue = true;
                            break;
                        }
                    }
                } else {
                    if (element.value !== "") {
                        hasValue = true;
                        break;
                    }
                }
            }
            if (hasValue) break;
        }

        setIsOptionalFieldsHasValue(hasValue);
        if (hasValue && !isOptionalFieldsVisible) {
            setIsOptionalFieldsVisible(true);
        }
    };

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            headerNode={messageHeader !== undefined ? advancedMsg(messageHeader) : msg("registerTitle")}
            displayMessage={messagesPerField.exists("global")}
            displayRequiredFields
        >
            <form id="kc-register-form" className={kcClsx("kcFormClass")} action={url.registrationAction} method="post">
                <div className="required-fields-section">
                    <UserProfileFormFields
                        kcContext={requiredKcContext}
                        i18n={i18n}
                        kcClsx={kcClsx}
                        onIsFormSubmittableValueChange={setIsRequiredFormSubmittable}
                        doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                    />
                </div>
                
                {optionalAttributesCount > 0 && (
                    <>
                        <div className="optional-fields-toggle-group">
                            <button
                                type="button"
                                className={clsx("optional-fields-toggle-button", { expanded: isOptionalFieldsVisible })}
                                onClick={() => {
                                    if (isOptionalFieldsHasValue) return;
                                    setIsOptionalFieldsVisible(!isOptionalFieldsVisible);
                                }}
                                disabled={isOptionalFieldsHasValue}
                            >
                                <span className="optional-fields-toggle-button-icon">{isOptionalFieldsVisible ? msg("hideOptionalFields") : msg("showOptionalFields")}</span>
                            </button>
                            {isOptionalFieldsHasValue && (
                            <span className="optional-fields-toggle-label">
                                * {msg("cannotHideOptionalFields")}
                            </span>
                            )}
                        </div>

                        <div
                            className={clsx("optional-fields-container", { hidden: !isOptionalFieldsVisible })}
                            onChange={onOptionalFieldsChange}
                        >
                            <UserProfileFormFields
                                kcContext={optionalKcContext}
                                i18n={i18n}
                                kcClsx={kcClsx}
                                onIsFormSubmittableValueChange={setIsOptionalFormSubmittable}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        </div>
                    </>
                )}

                {termsAcceptanceRequired && (
                    <TermsAcceptance
                        i18n={i18n}
                        kcClsx={kcClsx}
                        messagesPerField={messagesPerField}
                        areTermsAccepted={areTermsAccepted}
                        onAreTermsAcceptedValueChange={setAreTermsAccepted}
                    />
                )}
                {recaptchaRequired && (recaptchaVisible || recaptchaAction === undefined) && (
                    <div className="form-group">
                        <div className={kcClsx("kcInputWrapperClass")}>
                            <div className="g-recaptcha" data-size="compact" data-sitekey={recaptchaSiteKey} data-action={recaptchaAction}></div>
                        </div>
                    </div>
                )}
                <div className={kcClsx("kcFormGroupClass")}>
                    <div id="kc-form-options" className={kcClsx("kcFormOptionsClass")}>
                        <div className={kcClsx("kcFormOptionsWrapperClass")}>
                            <span>
                                <a href={url.loginUrl}>{msg("backToLogin")}</a>
                            </span>
                        </div>
                    </div>

                    {recaptchaRequired && !recaptchaVisible && recaptchaAction !== undefined ? (
                        <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                            <button
                                className={clsx(
                                    kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass"),
                                    "g-recaptcha"
                                )}
                                data-sitekey={recaptchaSiteKey}
                                data-callback="onSubmitRecaptcha"
                                data-action={recaptchaAction}
                                type="submit"
                            >
                                {msg("doRegister")}
                            </button>
                        </div>
                    ) : (
                        <div id="kc-form-buttons" className={kcClsx("kcFormButtonsClass")}>
                            <input
                                disabled={!isRequiredFormSubmittable || !isOptionalFormSubmittable || (termsAcceptanceRequired && !areTermsAccepted)}
                                className={kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass")}
                                type="submit"
                                value={msgStr("doRegister")}
                            />
                        </div>
                    )}
                </div>
            </form>
        </Template>
    );
}

function TermsAcceptance(props: {
    i18n: I18n;
    kcClsx: KcClsx;
    messagesPerField: Pick<KcContext["messagesPerField"], "existsError" | "get">;
    areTermsAccepted: boolean;
    onAreTermsAcceptedValueChange: (areTermsAccepted: boolean) => void;
}) {
    const { i18n, kcClsx, messagesPerField, areTermsAccepted, onAreTermsAcceptedValueChange } = props;

    const { msg } = i18n;

    return (
        <>
            <div className="form-group">
                <div className={kcClsx("kcInputWrapperClass")}>
                    {msg("termsTitle")}
                    <div id="kc-registration-terms-text">{msg("termsText")}</div>
                </div>
            </div>
            <div className="form-group">
                <div className={kcClsx("kcLabelWrapperClass")}>
                    <input
                        type="checkbox"
                        id="termsAccepted"
                        name="termsAccepted"
                        className={kcClsx("kcCheckboxInputClass")}
                        checked={areTermsAccepted}
                        onChange={e => onAreTermsAcceptedValueChange(e.target.checked)}
                        aria-invalid={messagesPerField.existsError("termsAccepted")}
                    />
                    <label htmlFor="termsAccepted" className={kcClsx("kcLabelClass")}>
                        {msg("acceptTerms")}
                    </label>
                </div>
                {messagesPerField.existsError("termsAccepted") && (
                    <div className={kcClsx("kcLabelWrapperClass")}>
                        <span
                            id="input-error-terms-accepted"
                            className={kcClsx("kcInputErrorMessageClass")}
                            aria-live="polite"
                            dangerouslySetInnerHTML={{
                                __html: kcSanitize(messagesPerField.get("termsAccepted"))
                            }}
                        />
                    </div>
                )}
            </div>
        </>
    );
}
