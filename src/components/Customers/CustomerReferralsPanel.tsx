import { useMemo } from "react";
import { Stack, Typography } from "@mui/material";
import { useInfiniteQuery } from "react-query";
import { DefaultRenderContainer } from "components/RenderList";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "components/Tables";
import { ReferralStatus } from "interfaces/referrals";
import { referralServices } from "services/referrals";
import { getNextPageParam } from "utils/query";

const STATUS_LABELS: Record<ReferralStatus, string> = {
  PENDING: "Pendente",
  CONVERTED: "Convertida",
  CANCELED: "Cancelada",
};

interface CustomerReferralsPanelProps {
  customerId: string;
}

function CustomerReferralsPanel({ customerId }: CustomerReferralsPanelProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery(
    ["customer-referrals", customerId],
    ({ pageParam = 1 }) =>
      referralServices.list({ page: pageParam, referrerId: customerId }),
    {
      enabled: Boolean(customerId),
      getNextPageParam,
    }
  );

  const referrals = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  return (
    <Stack spacing={2}>
      <Typography variant="subtitle1" fontWeight={700}>
        Indicações feitas
      </Typography>
      <TableContainer
        isLoading={isLoading}
        hasError={isError}
        errorFeedback={
          <DefaultRenderContainer>
            Não foi possível carregar as indicações.
          </DefaultRenderContainer>
        }
        isEmpty={!isLoading && referrals.length === 0}
        emptyFeedback={
          <DefaultRenderContainer>
            Nenhuma indicação registrada.
          </DefaultRenderContainer>
        }
        onScrolledToEnd={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        isFetchingNextPage={isFetchingNextPage}
        contentHeight="min(32vh, 280px)"
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Indicado</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {referrals.map((referral) => (
              <TableRow key={referral.id}>
                <TableCell>{referral.referredName}</TableCell>
                <TableCell>{STATUS_LABELS[referral.status]}</TableCell>
                <TableCell>
                  {new Date(referral.createdAt).toLocaleDateString("pt-BR")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}

export default CustomerReferralsPanel;
