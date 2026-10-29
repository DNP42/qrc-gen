import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Attributes whose value is read by users or screen readers.
const TEXT_ATTRIBUTE =
  "JSXAttribute[name.name=/^(placeholder|alt|title|aria-label|aria-description|aria-roledescription|aria-placeholder|aria-valuetext)$/]";
// `{...}` used as a child of an element, not as an attribute value.
const CHILD_EXPRESSION = ":matches(JSXElement, JSXFragment) > JSXExpressionContainer";
// Two letters in a row (Latin, incl. č/š/ž) means words; "#000000", "|" and
// "••••" do not, so language-neutral symbols stay allowed.
const TWO_LETTERS = "/[A-Za-z\\u00C0-\\u024F]{2}/";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // CLAUDE.md rule 2: UI copy lives in src/i18n/dictionaries, never inline
    // in JSX. Brand names and format names are the same in every language.
    files: ["src/**/*.tsx"],
    rules: {
      "react/jsx-no-literals": [
        "error",
        {
          allowedStrings: [
            "qrc-gen",
            "SpectreHawk",
            "qr-code-styling",
            "↓ PNG",
            "↓ SVG",
            ".",
          ],
        },
      ],
      // jsx-no-literals only sees bare JSX text. `{'text'}` (which its own
      // message suggests as a fix) and attribute values slip through, and
      // noStrings / noAttributeStrings would also flag className and href.
      // Cover those two gaps with selectors on the text attributes instead.
      "no-restricted-syntax": [
        "error",
        ...[
          `${TEXT_ATTRIBUTE} > Literal[value=${TWO_LETTERS}]`,
          `${TEXT_ATTRIBUTE} > JSXExpressionContainer > Literal[value=${TWO_LETTERS}]`,
          `${TEXT_ATTRIBUTE} > JSXExpressionContainer > TemplateLiteral > TemplateElement[value.raw=${TWO_LETTERS}]`,
          `${CHILD_EXPRESSION} > Literal[value=${TWO_LETTERS}]`,
          `${CHILD_EXPRESSION} > TemplateLiteral > TemplateElement[value.raw=${TWO_LETTERS}]`,
          `${CHILD_EXPRESSION} > :matches(ConditionalExpression, LogicalExpression) > Literal[value=${TWO_LETTERS}]`,
        ].map((selector) => ({
          selector,
          message:
            "Hard-coded UI text. Add it to src/i18n/dictionaries/en.ts and sl.ts (CLAUDE.md rule 2).",
        })),
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Agent worktrees are full copies of the repo; linting them multiplies every finding.
    ".claude/**",
  ]),
]);

export default eslintConfig;
