import { Link, useNavigate, useNavigation, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

import Modal from "../utils/Modal"; // Eliminamos .js
import EventForm from "../Complements/EventForm";
import { getEventDef, putEventDef } from "../../config/dependencies";
import type { EventPost, EventSingle } from "../../core/domain/models";
import LoadingIndicator from "../utils/LoadingIndicator";
import ErrorBlock from "../utils/ErrorBlock";
import { queryClient } from "../../App";

export default function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Tipamos el parámetro de la URL
  const { state } = useNavigation();

  // 1. Tipamos la query para saber que devuelve un EventSingle
  const { data, isPending, isError, error } = useQuery<EventSingle>({
    queryKey: ["events", { id }],
    queryFn: ({ signal }) => getEventDef(id!, signal),
    enabled: !!id, // Solo se ejecuta si hay ID
  });
  // 2. Mutación con Actualización Optimista
  const { mutate } = useMutation({
    // mutationFn: ({ id, event }: { id: string; event: EventPost }) =>
    //   putEventDef(id, event),
    mutationFn: (data: { id: string; event: EventPost }) => putEventDef(data),

    // Se ejecuta en cuanto llamamos a mutate()
    onMutate: async (data) => {
      const { id, event } = data;

      // A) Cancelamos peticiones salientes para que no sobrescriban nuestra actualización
      await queryClient.cancelQueries({ queryKey: ["events", { id }] });

      // B) Guardamos una "foto" del estado anterior por si tenemos que volver atrás
      const previousEvent = queryClient.getQueryData<EventSingle>([
        "events",
        { id },
      ]);

      // C) Actualizamos la caché manualmente con los nuevos datos
      queryClient.setQueryData(["events", { id }], (old: EventSingle) => ({
        ...old,
        ...event,
      }));

      // Retornamos el contexto con el valor previo
      return { previousEvent };
    },

    // Si la mutación falla, usamos el contexto para restaurar los datos
    onError: (_err, _newEvent, context) => {
      if (context?.previousEvent) {
        queryClient.setQueryData(["events", { id }], context.previousEvent);
      }
    },

    // Siempre se ejecuta al final (éxito o error) para sincronizar con el servidor
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["events", { id }] });
    },
  });

  // 2. Manejo de envío: transformamos el objeto de datos en un FormData para el Action de React Router
  function handleSubmit(formData: EventPost) {
    mutate({ id: id!, event: formData });
    navigate("../");
  }

  function handleClose() {
    navigate("../");
  }

  // 3. Lógica de contenido refinada
  if (isPending) {
    return (
      <Modal onClose={handleClose}>
        <LoadingIndicator />
      </Modal>
    );
  }

  if (isError) {
    return (
      <Modal onClose={handleClose}>
        <ErrorBlock
          title="An error occurred"
          message={(error as Error).message || "Failed to fetch event data"}
        />
        <div className="form-actions">
          <Link to="../" className="button">
            Okay
          </Link>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={handleClose}>
      {/* 4. Pasamos data (que es EventSingle) como inputData (EventData) */}
      <EventForm key={data.id} inputData={data} onSubmit={handleSubmit}>
        {state === "submitting" ? (
          <p>Sending data...</p>
        ) : (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Update
            </button>
          </>
        )}
      </EventForm>
    </Modal>
  );
}
