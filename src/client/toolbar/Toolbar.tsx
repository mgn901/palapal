import { memo, type ReactNode, useState } from "react";
import { Button } from "../components/Button.tsx";
import { Icon } from "../components/Icon.tsx";
import { Menu, MenuItem, MenuTrigger } from "../components/Menu.tsx";
import { Popover } from "../components/Popover.tsx";
import { Label, Text } from "../components/Text.tsx";
import {
  ToggleButton,
  ToggleButtonGroup,
} from "../components/ToggleButton.tsx";
import { Toolbar as AriaToolbar } from "../components/Toolbar.tsx";
import {
  usePreferredAppearanceMode,
  useSetPreferredAppearanceMode,
} from "../ui-state/appearance-mode.ts";
import { useSetViewMode, useViewMode } from "../ui-state/view-mode.ts";

export const Toolbar = memo((): ReactNode => {
  return (
    <AriaToolbar className="flex flex-row gap-x-2">
      <ToggleViewModeButton />
      <ToggleAppearanceModeButton />
      <MenuTrigger>
        <Button className="flex flex-row gap-x-0.5 px-1">
          <Icon name="help" />
          <span>Help</span>
        </Button>
        <Popover>
          <Menu>
            <MenuItem className="pr-8 pl-1">
              <Text slot="label">About palapal</Text>
            </MenuItem>
            <MenuItem className="pr-8 pl-1">
              <Text slot="label">Help</Text>
            </MenuItem>
          </Menu>
        </Popover>
      </MenuTrigger>
    </AriaToolbar>
  );
});

const ToggleViewModeButton = memo((): ReactNode => {
  const viewMode = useViewMode();
  const setViewMode = useSetViewMode();

  const [viewModeSelection, setViewModeSelection] = useState<
    Set<string | number>
  >(() => new Set([viewMode]));

  const handleViewModeSelectionChange = (keys: Set<string | number>) => {
    setViewModeSelection(keys);
    setViewMode(keys.has("compact") ? "compact" : "scrollable");
  };

  return (
    <ToggleButtonGroup
      aria-label="View"
      selectionMode="single"
      disallowEmptySelection={true}
      selectedKeys={viewModeSelection}
      onSelectionChange={handleViewModeSelectionChange}
    >
      <ToggleButton id="compact" className="px-1">
        <Label className="sr-only">Compact Table</Label>
        <Icon name="view_compact" />
      </ToggleButton>
      <ToggleButton id="scrollable" className="px-1">
        <Label className="sr-only">Scrollable Table</Label>
        <Icon name="view_cozy" />
      </ToggleButton>
    </ToggleButtonGroup>
  );
});

const ToggleAppearanceModeButton = memo((): ReactNode => {
  const preferredAppearanceMode = usePreferredAppearanceMode();
  const setPreferredAppearanceMode = useSetPreferredAppearanceMode();

  const [appearanceModeSelection, setAppearanceModeSelection] = useState<
    Set<string | number>
  >(
    () =>
      new Set(
        preferredAppearanceMode === "system" ? [] : [preferredAppearanceMode],
      ),
  );

  const handleAppearanceModeSelectionChange = (keys: Set<string | number>) => {
    setAppearanceModeSelection(keys);
    setPreferredAppearanceMode(
      keys.has("light") ? "light" : keys.has("dark") ? "dark" : "system",
    );
  };

  return (
    <ToggleButtonGroup
      aria-label="Appearance Mode"
      selectionMode="single"
      disallowEmptySelection={false}
      selectedKeys={appearanceModeSelection}
      onSelectionChange={handleAppearanceModeSelectionChange}
    >
      <ToggleButton id="light" className="px-1">
        <Label className="sr-only">Light Mode</Label>
        <Icon name="light_mode" />
      </ToggleButton>
      <ToggleButton id="dark" className="px-1">
        <Label className="sr-only">Dark Mode</Label>
        <Icon name="dark_mode" />
      </ToggleButton>
    </ToggleButtonGroup>
  );
});
