import InventoryRow from './InventoryRow';

export default function InventoryTable({ inventory, refresh, isVerified }) {
  return (
    <table border="1" cellPadding="10" width="100%">
      <thead>
        <tr>
          <th>Medicine</th>
          <th>Salt</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {inventory.map(item => (
          <InventoryRow
            key={item._id}
            item={item}
            refresh={refresh}
            isVerified={isVerified}
          />
        ))}
      </tbody>
    </table>
  );
}
