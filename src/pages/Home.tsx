import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import appConfig from "app.config";
import { useAuth } from "contexts/AuthContext";
import menuItems from "routes/menu";
import siteMap from "routes/siteMap";

function Home() {
  const { user } = useAuth();
  const modules = menuItems.filter(
    (item) => item.path !== siteMap.protected.home
  );

  return (
    <Stack spacing={4}>
      <div>
        <Typography variant="h4" fontWeight={700}>
          Olá, {user?.name}
        </Typography>
        <Typography color="text.secondary">
          Bem-vindo ao {appConfig.name}.
        </Typography>
      </div>

      <Grid container spacing={2}>
        {modules.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.path}>
            <Card>
              <CardActionArea component={RouterLink} to={item.path}>
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Stack sx={{ color: "primary.main" }}>{item.icon}</Stack>
                    <Typography fontWeight={700}>{item.label}</Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

export default Home;
