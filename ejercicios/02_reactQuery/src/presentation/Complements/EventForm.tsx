import { useState, type FormEvent, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import ImagePicker from "./ImagePicker";
import { getImageDef } from "../../config/dependencies";
import type { EventPost, EventSingle, Image } from "../../core/domain/models";

// Definimos la interfaz de las props del formulario
interface EventFormProps {
  inputData?: EventSingle; // Opcional para creación, requerido para edición
  onSubmit: (data: EventPost) => void;
  children: ReactNode; // Para los botones Cancelar/Crear
}

export default function EventForm({
  inputData,
  onSubmit,
  children,
}: EventFormProps) {
  // Tipamos el estado: el valor será el 'path' de la imagen (string) o undefined
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    inputData?.image
  );

  function handleSelectImage(imagePath: string): void {
    setSelectedImage(imagePath);
  }

  // Tipamos useQuery con el array de imágenes que esperamos del backend
  const {
    data: images,
    isPending,
    isError,
  } = useQuery<Image[]>({
    queryKey: ["events-images"],
    queryFn: ({ signal }) => getImageDef(signal),
    select: (data: any) => data.images,
  });
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    // Extraemos los datos del formulario usando el API nativa FormData
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData) as unknown as EventPost;

    // Combinamos los campos de texto con la imagen seleccionada en el estado

    onSubmit({ ...data, image: selectedImage });
  }

  // Gestión de estados de carga de imágenes
  if (isPending) return <p>Loading images...</p>;
  if (isError || !images) return <p>Error loading image selector.</p>;

  return (
    <form id="event-form" onSubmit={handleSubmit}>
      <p className="control">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          required
          defaultValue={inputData?.title ?? ""}
        />
      </p>

      <div className="control">
        {/* Pasamos los datos tipados al ImagePicker */}
        <ImagePicker
          images={images}
          onSelect={handleSelectImage}
          selectedImage={selectedImage}
        />
      </div>

      <p className="control">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          required
          defaultValue={inputData?.description ?? ""}
        />
      </p>

      <div className="controls-row">
        <p className="control">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            required
            defaultValue={inputData?.date ?? ""}
          />
        </p>

        <p className="control">
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            required
            defaultValue={inputData?.time ?? ""}
          />
        </p>
      </div>

      <p className="control">
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          required
          defaultValue={inputData?.location ?? ""}
        />
      </p>

      <p className="form-actions">{children}</p>
    </form>
  );
}
