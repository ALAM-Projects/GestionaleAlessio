import Spinner from "@/components/ui/spinner";

const Loading = () => {
  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center p-6">
      <Spinner
        size="lg"
        text="Caricamento cliente"
        subtitle="Recupero scheda e storico allenamenti in corso..."
      />
    </div>
  );
};

export default Loading;
