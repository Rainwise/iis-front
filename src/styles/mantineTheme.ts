"use client";
import {
  createTheme,
  Modal,
  PasswordInput,
  Select,
  TextInput,
  Pagination,
} from "@mantine/core";

// Style Imports
import { colors } from "@/styles/colors";
import mantineModalStyles from "@/styles/mantineComponentOverrides/mantineModal.module.css";
import mantineSelectStyles from "@/styles/mantineComponentOverrides/mantineSelect.module.css";
import mantineTextInputStyles from "@/styles/mantineComponentOverrides/mantineTextInput.module.css";
import mantinePaginationStyles from "@/styles/mantineComponentOverrides/mantinePagination.module.css";

export const theme = createTheme({
  fontFamily: "Inter, sans-serif",
  breakpoints: {
    xs: "30em",
    sm: "40em",
    md: "48em",
    lg: "70em",
    xl: "80em",
  },
  colors: colors,
  cursorType: "pointer",
  components: {
    Modal: Modal.extend({
      classNames: mantineModalStyles,
    }),
    Select: Select.extend({
      classNames: mantineSelectStyles,
    }),
    TextInput: TextInput.extend({
      classNames: mantineTextInputStyles,
    }),
    PasswordInput: PasswordInput.extend({
      classNames: mantineTextInputStyles,
    }),
    Pagination: Pagination.extend({
      classNames: mantinePaginationStyles,
    }),
  },
});
