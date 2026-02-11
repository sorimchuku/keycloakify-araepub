/* eslint-disable @typescript-eslint/no-unused-vars */
import { i18nBuilder } from "keycloakify/login";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { useI18n, ofTypeI18n } = i18nBuilder.withThemeName<ThemeName>()
.withExtraLanguages({
    ko: {
        label: "한국어",
        getMessages: () => import("./i18n.ko"),
    },
    id: {
        label: "Indonesia",
        getMessages: () => import("./i18n.id"),
    }
})
.withCustomTranslations({
    en: {
        hideOptionalFields: "Hide optional fields",
        showOptionalFields: "Show optional fields",
        requiredFieldIndicator: "Required",
        cannotHideOptionalFields: "This area cannot be hidden when the content is entered.",
        resendEmail: "Resend email",
        "profile.attributes.plan": "Plan",
        "profile.attributes.name": "Name",
        "profile.attributes.birthdate": "Birth Date",
        "profile.attributes.gender": "Gender",
        "profile.attributes.region": "Region",
        "profile.attributes.over-14": "I am at least 14 years old",
        "profile.attributes.phoneNumber": "Phone Number",
        "profile.attributes.gender.options.male": "Male",
        "profile.attributes.gender.options.female": "Female",
        "profile.attributes.region.options.domestic": "Korean",
        "profile.attributes.region.options.foreign": "Foreigner",
        "profile.attributes.over-14.options.over-14": "I am over 14 years old."
    },
    ko: {
        hideOptionalFields: "추가 항목 숨기기",
        showOptionalFields: "추가 항목 입력하기(선택)",
        requiredFieldIndicator: "필수 항목",
        cannotHideOptionalFields: "입력된 내용이 있을 때는 숨길 수 없습니다.",
        resendEmail: "이메일 다시 보내기",
        "profile.attributes.plan": "요금제",
        "profile.attributes.name": "이름",
        "profile.attributes.birthdate": "생년월일",
        "profile.attributes.gender": "성별",
        "profile.attributes.region": "국적",
        "profile.attributes.over-14": "14세 이상 회원",
        "profile.attributes.phoneNumber": "휴대전화 번호",
        "profile.attributes.gender.options.male": "남성",
        "profile.attributes.gender.options.female": "여성",
        "profile.attributes.region.options.domestic": "내국인",
        "profile.attributes.region.options.foreign": "외국인",
        "profile.attributes.over-14.options.over-14": "14세 이상입니다."
    },
    id: {
        hideOptionalFields: "Sembunyikan opsi",
        showOptionalFields: "Tampilkan opsi",
        requiredFieldIndicator: "Wajib",
        cannotHideOptionalFields: "Anda tidak dapat menyembunyikan konten yang dimasukkan.",
        resendEmail: "Kirim ulang email",
        "profile.attributes.plan": "Plan",
        "profile.attributes.name": "Nama",
        "profile.attributes.birthdate": "Tanggal Lahir",
        "profile.attributes.gender": "Jenis Kelamin",
        "profile.attributes.region": "Negara",
        "profile.attributes.over-14": "Saya lebih dari 14 tahun",
        "profile.attributes.phoneNumber": "Nomor Telepon",
        "profile.attributes.gender.options.male": "Laki-laki",
        "profile.attributes.gender.options.female": "Perempuan",
        "profile.attributes.region.options.domestic": "Korea",
        "profile.attributes.region.options.foreign": "Asing",
        "profile.attributes.over-14.options.over-14": "Saya lebih dari 14 tahun."
    }
})
.build();

type I18n = typeof ofTypeI18n;

export { useI18n, type I18n };
