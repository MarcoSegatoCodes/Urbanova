import { useMemo, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  FormControlLabel,
  Switch,
  Button,
  Alert,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";
import {
  LightMode,
  DarkMode,
  SettingsBrightness,
  Save,
  Undo,
} from "@mui/icons-material";
import {
  getSettings,
  updateDisplaySettings,
  updateSystemSettings,
} from "../services/SettingsService";
import type {
  DisplaySettings,
  ThemeMode,
  Language,
  TimeFormat,
  DistanceUnit,
  CurrencyCode,
} from "../types/settings.types";

interface LocalState {
  theme: ThemeMode;
  language: Language;
  timeFormat: TimeFormat;
  distanceUnit: DistanceUnit;
  compactView: boolean;
  currency: CurrencyCode;
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="overline"
          sx={{ color: "text.secondary", fontWeight: 700, letterSpacing: 1.2, mb: 2.5, display: "block" }}
        >
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        py: 1,
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        {description && (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {description}
          </Typography>
        )}
      </Box>
      <Box sx={{ flexShrink: 0 }}>{children}</Box>
    </Box>
  );
}

export default function Settings() {
  const initial = useMemo(() => {
    const s = getSettings();
    return {
      theme: s.display.theme,
      language: s.display.language,
      timeFormat: s.display.timeFormat,
      distanceUnit: s.display.distanceUnit,
      compactView: s.display.compactView,
      currency: s.system.defaultCurrency,
    } satisfies LocalState;
  }, []);

  const [state, setState] = useState<LocalState>(initial);
  const [saved, setSaved] = useState(false);

  const hasChanges = JSON.stringify(state) !== JSON.stringify(initial);

  const set = <K extends keyof LocalState>(key: K, value: LocalState[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    updateDisplaySettings({
      theme: state.theme,
      language: state.language,
      timeFormat: state.timeFormat,
      distanceUnit: state.distanceUnit,
      compactView: state.compactView,
    });
    updateSystemSettings({ defaultCurrency: state.currency });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDiscard = () => {
    setState(initial);
    setSaved(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Settings
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              Preferences saved to your browser
            </Typography>
          </Box>
          {hasChanges && (
            <Chip label="Unsaved changes" color="warning" size="small" />
          )}
        </Box>

        {saved && (
          <Alert severity="success" onClose={() => setSaved(false)}>
            Settings saved successfully.
          </Alert>
        )}

        {/* Appearance */}
        <SectionCard title="Appearance">
          <Stack divider={<Divider />}>
            <SettingRow label="Theme" description="Interface color scheme">
              <ToggleButtonGroup
                value={state.theme}
                exclusive
                size="small"
                onChange={(_, v) => v && set("theme", v as ThemeMode)}
              >
                <ToggleButton value="light" sx={{ gap: 0.5, px: 1.5 }}>
                  <LightMode fontSize="small" />
                  <Typography variant="caption">Light</Typography>
                </ToggleButton>
                <ToggleButton value="system" sx={{ gap: 0.5, px: 1.5 }}>
                  <SettingsBrightness fontSize="small" />
                  <Typography variant="caption">System</Typography>
                </ToggleButton>
                <ToggleButton value="dark" sx={{ gap: 0.5, px: 1.5 }}>
                  <DarkMode fontSize="small" />
                  <Typography variant="caption">Dark</Typography>
                </ToggleButton>
              </ToggleButtonGroup>
            </SettingRow>

            <SettingRow label="Compact view" description="Denser tables and lists">
              <Switch
                checked={state.compactView}
                size="small"
                onChange={(e) => set("compactView", e.target.checked)}
              />
            </SettingRow>
          </Stack>
        </SectionCard>

        {/* Regional */}
        <SectionCard title="Regional">
          <Stack divider={<Divider />}>
            <SettingRow label="Language">
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Language</InputLabel>
                <Select
                  value={state.language}
                  label="Language"
                  onChange={(e) => set("language", e.target.value as Language)}
                >
                  <MenuItem value="en">🇬🇧 English</MenuItem>
                  <MenuItem value="it">🇮🇹 Italian</MenuItem>
                  <MenuItem value="es">🇪🇸 Spanish</MenuItem>
                  <MenuItem value="fr">🇫🇷 French</MenuItem>
                  <MenuItem value="de">🇩🇪 German</MenuItem>
                  <MenuItem value="zh">🇨🇳 Chinese</MenuItem>
                </Select>
              </FormControl>
            </SettingRow>

            <SettingRow label="Time format">
              <ToggleButtonGroup
                value={state.timeFormat}
                exclusive
                size="small"
                onChange={(_, v) => v && set("timeFormat", v as TimeFormat)}
              >
                <ToggleButton value="24h" sx={{ px: 2 }}>24h</ToggleButton>
                <ToggleButton value="12h" sx={{ px: 2 }}>12h</ToggleButton>
              </ToggleButtonGroup>
            </SettingRow>

            <SettingRow label="Distance unit">
              <ToggleButtonGroup
                value={state.distanceUnit}
                exclusive
                size="small"
                onChange={(_, v) => v && set("distanceUnit", v as DistanceUnit)}
              >
                <ToggleButton value="km" sx={{ px: 2 }}>km</ToggleButton>
                <ToggleButton value="miles" sx={{ px: 2 }}>mi</ToggleButton>
              </ToggleButtonGroup>
            </SettingRow>

            <SettingRow label="Currency">
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={state.currency}
                  label="Currency"
                  onChange={(e) => set("currency", e.target.value as CurrencyCode)}
                >
                  <MenuItem value="EUR">EUR — Euro</MenuItem>
                  <MenuItem value="USD">USD — US Dollar</MenuItem>
                  <MenuItem value="GBP">GBP — British Pound</MenuItem>
                  <MenuItem value="JPY">JPY — Japanese Yen</MenuItem>
                  <MenuItem value="CNY">CNY — Chinese Yuan</MenuItem>
                  <MenuItem value="AUD">AUD — Australian Dollar</MenuItem>
                </Select>
              </FormControl>
            </SettingRow>
          </Stack>
        </SectionCard>

        {/* Actions */}
        <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            startIcon={<Undo />}
            onClick={handleDiscard}
            disabled={!hasChanges}
          >
            Discard
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={!hasChanges}
          >
            Save
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}
