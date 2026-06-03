import { useMemo, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  CardHeader,
  TextField,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Button,
  Alert,
  Divider,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  getSettings,
  updateDisplaySettings,
  updateNotificationSettings,
  updateSystemSettings,
} from "../services/SettingsService";
import type {
  DisplaySettings,
  NotificationSettings,
  SystemSettings,
  ThemeMode,
  Language,
  TimeFormat,
  DistanceUnit,
  CurrencyCode,
} from "../types/settings.types";

export default function Settings() {
  const initialSettings = useMemo(() => getSettings(), []);

  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>(
    initialSettings.display,
  );
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>(initialSettings.notifications);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(
    initialSettings.system,
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  const hasChanges =
    JSON.stringify(displaySettings) !==
      JSON.stringify(initialSettings.display) ||
    JSON.stringify(notificationSettings) !==
      JSON.stringify(initialSettings.notifications) ||
    JSON.stringify(systemSettings) !== JSON.stringify(initialSettings.system);

  const handleSave = () => {
    updateDisplaySettings(displaySettings);
    updateNotificationSettings(notificationSettings);
    updateSystemSettings(systemSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    setDisplaySettings(initialSettings.display);
    setNotificationSettings(initialSettings.notifications);
    setSystemSettings(initialSettings.system);
    setSaveSuccess(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure your application preferences
          </Typography>
        </Box>

        {/* Success Alert */}
        {saveSuccess && (
          <Alert severity="success" onClose={() => setSaveSuccess(false)}>
            Settings saved successfully!
          </Alert>
        )}

        {/* Display Settings */}
        <Card>
          <CardHeader
            title="Display Settings"
            subheader="Appearance and localization preferences"
          />
          <Divider />
          <CardContent>
            <Stack spacing={2.5}>
              {/* Theme */}
              <FormControl fullWidth>
                <InputLabel>Theme</InputLabel>
                <Select
                  value={displaySettings.theme}
                  onChange={(e) =>
                    setDisplaySettings({
                      ...displaySettings,
                      theme: e.target.value as ThemeMode,
                    })
                  }
                  label="Theme"
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="system">System</MenuItem>
                </Select>
              </FormControl>

              {/* Language */}
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={displaySettings.language}
                  onChange={(e) =>
                    setDisplaySettings({
                      ...displaySettings,
                      language: e.target.value as Language,
                    })
                  }
                  label="Language"
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                  <MenuItem value="de">German</MenuItem>
                  <MenuItem value="zh">Chinese</MenuItem>
                  <MenuItem value="ja">Japanese</MenuItem>
                </Select>
              </FormControl>

              {/* Time Format */}
              <FormControl fullWidth>
                <InputLabel>Time Format</InputLabel>
                <Select
                  value={displaySettings.timeFormat}
                  onChange={(e) =>
                    setDisplaySettings({
                      ...displaySettings,
                      timeFormat: e.target.value as TimeFormat,
                    })
                  }
                  label="Time Format"
                >
                  <MenuItem value="12h">12-Hour (AM/PM)</MenuItem>
                  <MenuItem value="24h">24-Hour</MenuItem>
                </Select>
              </FormControl>

              {/* Distance Unit */}
              <FormControl fullWidth>
                <InputLabel>Distance Unit</InputLabel>
                <Select
                  value={displaySettings.distanceUnit}
                  onChange={(e) =>
                    setDisplaySettings({
                      ...displaySettings,
                      distanceUnit: e.target.value as DistanceUnit,
                    })
                  }
                  label="Distance Unit"
                >
                  <MenuItem value="km">Kilometers (km)</MenuItem>
                  <MenuItem value="miles">Miles (mi)</MenuItem>
                </Select>
              </FormControl>

              {/* Compact View */}
              <FormControlLabel
                control={
                  <Switch
                    checked={displaySettings.compactView}
                    onChange={(e) =>
                      setDisplaySettings({
                        ...displaySettings,
                        compactView: e.target.checked,
                      })
                    }
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Compact View
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Use compact layout for tables and lists
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: "flex-start", mt: 1 }}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader
            title="Notification Settings"
            subheader="Control how you receive notifications"
          />
          <Divider />
          <CardContent>
            <Stack spacing={2}>
              {/* Email */}
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.email}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        email: e.target.checked,
                      })
                    }
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Email Notifications
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Receive updates via email
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: "flex-start" }}
              />

              {/* Push Notifications */}
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.push}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        push: e.target.checked,
                      })
                    }
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Push Notifications
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Receive browser push notifications
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: "flex-start" }}
              />

              {/* SMS */}
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.sms}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        sms: e.target.checked,
                      })
                    }
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      SMS Notifications
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Receive SMS messages
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: "flex-start" }}
              />

              <Divider sx={{ my: 1 }} />

              {/* Trip Reminders */}
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.tripReminders}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        tripReminders: e.target.checked,
                      })
                    }
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Trip Reminders
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Reminders for upcoming trips
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: "flex-start" }}
              />

              {/* Service Alerts */}
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.serviceAlerts}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        serviceAlerts: e.target.checked,
                      })
                    }
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Service Alerts
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Important service and maintenance alerts
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: "flex-start" }}
              />

              {/* Promotions */}
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.promotions}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        promotions: e.target.checked,
                      })
                    }
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Promotions & Offers
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Receive promotional offers and discounts
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: "flex-start" }}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader
            title="System Settings"
            subheader="Configure system-wide parameters"
          />
          <Divider />
          <CardContent>
            <Stack spacing={2.5}>
              {/* Currency */}
              <FormControl fullWidth>
                <InputLabel>Default Currency</InputLabel>
                <Select
                  value={systemSettings.defaultCurrency}
                  onChange={(e) =>
                    setSystemSettings({
                      ...systemSettings,
                      defaultCurrency: e.target.value as CurrencyCode,
                    })
                  }
                  label="Default Currency"
                >
                  <MenuItem value="USD">USD - US Dollar</MenuItem>
                  <MenuItem value="EUR">EUR - Euro</MenuItem>
                  <MenuItem value="GBP">GBP - British Pound</MenuItem>
                  <MenuItem value="JPY">JPY - Japanese Yen</MenuItem>
                  <MenuItem value="CNY">CNY - Chinese Yuan</MenuItem>
                  <MenuItem value="AUD">AUD - Australian Dollar</MenuItem>
                </Select>
              </FormControl>

              {/* Max Booking Days */}
              <TextField
                label="Max Booking Days Ahead"
                type="number"
                value={systemSettings.maxBookingDaysAhead}
                onChange={(e) =>
                  setSystemSettings({
                    ...systemSettings,
                    maxBookingDaysAhead: parseInt(e.target.value) || 0,
                  })
                }
                inputProps={{ min: 1, max: 365 }}
                fullWidth
                helperText="Maximum number of days users can book in advance"
              />

              {/* Min Booking Minutes */}
              <TextField
                label="Min Booking Minutes Before"
                type="number"
                value={systemSettings.minBookingMinutesBefore}
                onChange={(e) =>
                  setSystemSettings({
                    ...systemSettings,
                    minBookingMinutesBefore: parseInt(e.target.value) || 0,
                  })
                }
                inputProps={{ min: 1, max: 1440 }}
                fullWidth
                helperText="Minimum minutes before trip start to book"
              />

              {/* Refund Policy Days */}
              <TextField
                label="Refund Policy Days"
                type="number"
                value={systemSettings.refundPolicyDays}
                onChange={(e) =>
                  setSystemSettings({
                    ...systemSettings,
                    refundPolicyDays: parseInt(e.target.value) || 0,
                  })
                }
                inputProps={{ min: 0, max: 365 }}
                fullWidth
                helperText="Number of days for refund eligibility"
              />

              {/* Support Email */}
              <TextField
                label="Support Email"
                type="email"
                value={systemSettings.supportEmail}
                onChange={(e) =>
                  setSystemSettings({
                    ...systemSettings,
                    supportEmail: e.target.value,
                  })
                }
                fullWidth
                helperText="Email address for customer support"
              />

              {/* Support Phone */}
              <TextField
                label="Support Phone (Optional)"
                type="tel"
                value={systemSettings.supportPhone || ""}
                onChange={(e) =>
                  setSystemSettings({
                    ...systemSettings,
                    supportPhone: e.target.value || undefined,
                  })
                }
                fullWidth
                helperText="Phone number for customer support"
              />

              <Divider sx={{ my: 1 }} />

              {/* Maintenance Mode */}
              <FormControlLabel
                control={
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        maintenanceMode: e.target.checked,
                      })
                    }
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Maintenance Mode
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Enable maintenance mode to restrict access
                    </Typography>
                  </Box>
                }
                sx={{ alignItems: "flex-start" }}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
            pt: 2,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<RestartAltIcon />}
            onClick={handleReset}
            disabled={!hasChanges}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!hasChanges}
          >
            Save Settings
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}
