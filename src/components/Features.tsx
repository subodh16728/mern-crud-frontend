import Joi from "joi";
import { useState, ChangeEvent, useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FeatureProp, ErrorContainer } from "../utils/model";

const Features = ({
  data,
  index,
  onChange,
  onDelete,
  submitted,
}: FeatureProp) => {
  const [errors, setErrors] = useState<ErrorContainer>({});

  useEffect(() => {
    validateData();
  }, [submitted]);

  const validateData = () => {
    const featureSchema = Joi.object({
      title: Joi.string().min(3).required(),
      value: Joi.string().min(3).required(),
      _id: Joi.any().strip(),
    });

    const { error } = featureSchema.validate(data, { abortEarly: true });
    if (error) {
      const valErr: ErrorContainer = {};
      error.details.forEach((err) => {
        valErr[err.path[0]] = err.message;
      });
      setErrors(valErr);
    } else {
      setErrors({});
    }
  };

  const handleFeatureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(index, name, value);
  };

  const handleDelete = () => {
    if (window.confirm("Do you really want to delete this feature?")) {
      onDelete(index);
    }
  };

  return (
    <div className="container mb-3">
      <div className="row">
        <div className="col-sm">
          <div className="form-group">
            <label htmlFor="title" className="mb-1">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={data.title}
              onChange={handleFeatureChange}
              placeholder="Enter title"
            />
            <small className="text-danger">{errors.title}</small>
          </div>
        </div>
        <div className="col-sm">
          <div className="form-group">
            <label htmlFor="value" className="mb-1">
              Value
            </label>
            <input
              type="text"
              className="form-control"
              id="value"
              name="value"
              value={data.value}
              onChange={handleFeatureChange}
              placeholder="Enter value"
            />
            <small className="text-danger">{errors.value}</small>
          </div>
        </div>
        <div className="col-sm-auto">
          <OverlayTrigger
            overlay={(props) => <Tooltip {...props}>Delete feature</Tooltip>}
            placement="top"
          >
            <i
              className="bi bi-trash3-fill icon"
              data-toggle="tooltip"
              onClick={handleDelete}
            ></i>
          </OverlayTrigger>
        </div>
      </div>
    </div>
  );
};

export default Features;
