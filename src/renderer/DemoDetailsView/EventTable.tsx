import DataTable from "react-data-table-component";

import { IconButton, Tooltip } from "@mui/material";
import { ArrowDownward, Add as AddIcon } from "@mui/icons-material";

import { getPreferredTheme } from "../theme";
import DemoEvent from "../DemoEvent";

const columns = [
  {
    name: "Tick",
    selector: "tick",
    sortable: true,
    grow: 1,
  },
  {
    name: "Type",
    selector: "name",
    sortable: false,
    grow: 1,
  },
  {
    name: "Value",
    selector: "value",
    sortable: false,
    grow: 4,
  },
];

type EventTableProps = {
  data: DemoEvent[];
  editEvent: (event: DemoEvent) => void;
  addEvent: () => void;
};

export default function EventTable(props: EventTableProps) {
  const { data, editEvent, addEvent } = props;
  return (
    <DataTable
      title="Events"
      columns={columns}
      defaultSortField="tick"
      defaultSortAsc
      highlightOnHover
      noDataComponent={
        <div style={{ height: "2rem" }}>
          This demo doesn&apos;t have any events recorded.
        </div>
      }
      actions={
        <Tooltip title="Add event">
          <IconButton onClick={addEvent} size="large">
            <AddIcon />
          </IconButton>
        </Tooltip>
      }
      data={data}
      onRowClicked={editEvent}
      pointerOnHover
      sortIcon={<ArrowDownward />}
      fixedHeader
      // 64px: Page title,
      // 1px: Divider,
      // 24px and 5px: padding,
      // 56px: table title,
      // 57px: table header.
      fixedHeaderScrollHeight="calc(100vh - 64px - 1px - 2 * 24px - 2 * 5px - 56px - 57px)"
      theme={getPreferredTheme()}
      customStyles={{
        header: { style: { backgroundColor: "transparent" } },
        table: { style: { backgroundColor: "transparent" } },
        headRow: { style: { backgroundColor: "transparent" } },
        rows: { style: { backgroundColor: "transparent" } },
        noData: { style: { backgroundColor: "transparent" } },
      }}
    />
  );
}
