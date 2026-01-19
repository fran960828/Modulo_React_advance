import { Link, useNavigate } from "react-router-dom";

import Modal from "../utils/Modal";
import EventForm from "../Complements/EventForm.js";
import { useMutation } from "@tanstack/react-query";
import { postEventDef } from "../../config/dependencies.js";
import type { EventPost } from "../../core/domain/models.js";

export default function NewEvent() {
  const navigate = useNavigate();

  const { mutate, isPending, isError, error } = useMutation({
    mutationKey: ["events", "new"],
    mutationFn: (event: EventPost) => postEventDef(event),
  });

  function handleSubmit(formData: any) {
    mutate(formData);
    navigate("/events");
  }

  return (
    <Modal onClose={() => navigate("../")}>
      <EventForm onSubmit={handleSubmit}>
        {/* 6. Gestionamos el estado de carga (isPending) */}
        {isPending ? (
          <p>Enviando datos...</p>
        ) : (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {/* 7. Feedback de error si falla el backend */}
      {isError && <p>{(error as Error).message}</p>}
    </Modal>
  );
}
