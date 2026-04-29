import { Box, Paper, Stack, Typography } from "@mui/material";

export default function Home() {
  const panels = [
    {
      title: "Operations",
      text: "Controlla rapidamente stazioni, viaggi e veicoli dal menu laterale.",
    },
    {
      title: "Monitoring",
      text: "Tieni il focus su disponibilita, manutenzione e flussi operativi.",
    },
    {
      title: "Management",
      text: "Gestisci utenti, impostazioni e processi in un unico spazio.",
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Home
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Benvenuto in Urbanova. Usa la navigazione laterale per entrare nelle diverse aree della piattaforma.
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        {panels.map((panel) => (
          <Paper
            key={panel.title}
            elevation={2}
            sx={{ p: 3, flex: 1, borderRadius: 3 }}
          >
            <Typography variant="h6" gutterBottom>
              {panel.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {panel.text}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
