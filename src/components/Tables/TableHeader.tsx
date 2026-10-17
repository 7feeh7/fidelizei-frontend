import { styled } from "@mui/material";
import MUITableHead from "@mui/material/TableHead";

export const TableHead = styled(MUITableHead)(({ theme }) => ({
  "& .MuiTableCell-head": {
    color: theme.palette.primary.contrastText,
    backgroundColor: theme.palette.primary.main,
    borderLeft: `1px solid ${theme.palette.common.white}`,
    fontWeight: 700,
  },
  "& th:first-of-type": {
    borderLeft: "none",
    borderRadius: "10px 0 0 0",
  },
  "& th:last-of-type": {
    borderRadius: "0 10px 0 0",
  },
}));
