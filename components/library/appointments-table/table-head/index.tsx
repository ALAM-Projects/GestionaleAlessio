const TableHead = () => {
  return (
    <div className="grid grid-cols-12 gap-5 mb-2">
      <div className="text-md text-neutral-500 col-span-3">Cliente</div>
      <div className="text-md text-neutral-500 col-span-1">Data</div>
      <div className="text-md text-neutral-500 col-span-1">Ora</div>
      <div className="text-md text-neutral-500 col-span-1">Stato</div>
      <div className="text-md text-neutral-500 col-span-1">Prezzo</div>
      <div className="text-md text-neutral-500 col-span-2">Stato pagamento</div>
      <div className="text-md text-right text-neutral-500 col-span-3"></div>
    </div>
  );
};

export default TableHead;
