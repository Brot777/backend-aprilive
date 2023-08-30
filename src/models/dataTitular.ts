import { model, Schema } from "mongoose";

const dataTitularSchema = new Schema(
  {
    proTitle: {
      type: String,
      default: "",
    },
    proTitleVisible: {
      type: Boolean,
      default: true,
    },
    proEmail: {
      type: String,
      default: "",
    },
    proEmailVisible: {
      type: Boolean,
      default: true,
    },
    phoneArea: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    phoneVisible: {
      type: Boolean,
      default: true,
    },
    sex: {
      type: String,
      default: "",
    },
    sexVisible: {
      type: Boolean,
      default: true,
    },
    country: {
      type: String,
      default: "",
    },
    provinceDepartmentState: {
      type: String,
      default: "",
    },

    cityId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

export default model("DataTitular", dataTitularSchema);

/* {
    pro_title:string,
    pro_title_visible: boolean,
    pro_email: string,
    pro_email_visible: boolean,
    phone_area: string,
    phone: string,
    phone_visible: boolean,
    sex: number,
    sex_visible: boolean,
    location: {
      country: string,
      province_department_state:string,
      city_id: string
    },
    compensacion:any| {
      payment_currency: string|any,
      payment_amount: number|any,
      payment_date: string|any
    }
  } */
