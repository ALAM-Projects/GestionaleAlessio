import Spinner from "@/components/ui/spinner";

const Loading = () => {
  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center p-6">
      <Spinner
        size="lg"
        text="Caricamento dashboard"
        subtitle="Preparazione delle statistiche e dei dati in corso..."
      />
    </div>
  );
};

export default Loading;
