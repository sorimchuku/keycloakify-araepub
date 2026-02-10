import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { keycloakify } from "keycloakify/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        keycloakify({
            accountThemeImplementation: "none",
            kcContextExclusionsFtl: `
                <@addToXKeycloakifyMessagesIfMessageKey str="requiredFieldIndicator" />
                <@addToXKeycloakifyMessagesIfMessageKey str="hideOptionalFields" />
                <@addToXKeycloakifyMessagesIfMessageKey str="showOptionalFields" />
                `
        })
    ]
});
