import { model, Schema } from "mongoose";
import { User } from "../interfaces/user.interface";

const userSchema = new Schema<User>(
  {
    /* INICIO--- REQUERIDOS AL INICIAR SESION */
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },
    /* FIN ----REQUERIDOS AL INICIAR SESION */

    photoUrl: {
      type: String,
      default: "",
    },
    profileUrl: {
      type: String,
      default: "",
    },
    accountType: {
      type: String,
      default: "", // sting 0 o 1
    },

    videoUrl: {
      type: String,
      default: "",
    },

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

    compensation: {
      type: Schema.Types.Mixed,
      default: {
        payment_currency: "",
        payment_amount: 0,
        payment_date: "",
      },
    },

    status: {
      type: Boolean,
      default: true,
    },
    birthday: {
      type: Date,
      default: new Date(),
    },

    about: {
      type: String,
      default: "",
    },

    numberFollowers: {
      type: Number,
      default: 0,
    },
    numberFollowing: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },

    preferences: {
      type: [{ type: Schema.Types.ObjectId, ref: "Preference" }],
      default: [], //array de referencias de id {id, value}
    },
    networks: {
      type: [{ type: Schema.Types.ObjectId, ref: "Network" }],
      default: [], // por definir
    },
    networkMore: {
      type: [{ type: Schema.Types.ObjectId, ref: "Network" }],
      default: [],
    },
    workExperience: {
      type: [{ type: Schema.Types.ObjectId, ref: "WorkExperience" }],
      default: [],
    },

    education: {
      type: [{ type: Schema.Types.ObjectId, ref: "Education" }],
      default: [],
    },
    languages: {
      type: [{ type: Schema.Types.ObjectId, ref: "Languaje" }],
      default: [],
    },
    myCompanies: {
      type: [{ type: Schema.Types.ObjectId, ref: "Company" }],
      default: [], //array de referencia de id {id, npmbre}
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("User", userSchema);

/* 

--------tipos de datos

{
  id: string|undefined,
  first_name: string,
  last_name: string,
  username: string,
  email: string,
  photo_url: string,
  profile_url: string,
  account_type:string,
  video_url:string,
  dataTitular: {
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
  },
  status: boolean,
  birthday: string,
  about: string,
  preference: { id: any | undefined; value: string }[],
  network: []|any,
  network_more: []|any,
  work_experience: [],
  education: []|any,
  language: []|any

} */
