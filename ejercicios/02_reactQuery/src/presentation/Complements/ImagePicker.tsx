import type { ImagePickerProp } from "../../core/domain/models";

export default function ImagePicker({
  images,
  selectedImage,
  onSelect,
}: ImagePickerProp) {
  if (!images || images.length === 0) {
    return <p>No images available.</p>;
  }

  return (
    <div id="image-picker">
      <p>Select an image</p>
      <ul>
        {images.map((image) => {
          // DEBUG: Descomenta esto para ver por qué no coinciden
          // console.log("Comparando:", selectedImage, "CON:", image.path);

          const isSelected = selectedImage === image.path;

          return (
            <li
              key={image.path}
              onClick={() => onSelect(image.path)}
              className={isSelected ? "selected" : undefined}
            >
              {/* Solo renderizamos la imagen si el path existe */}
              {image.path ? (
                <img
                  src={`http://localhost:3000/${image.path}`}
                  alt={image.caption || "Event selection"}
                />
              ) : (
                <div className="fallback-image" />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
