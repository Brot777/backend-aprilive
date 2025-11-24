import mongoose, { model, Schema } from "mongoose";
import { User } from "../interfaces/user.interface";

const userSchema = new Schema<User>(
  {
    /* INICIO--- REQUERIDOS AL INICIAR SESION */
    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: false,
    },

    email: {
      value: {
        type: String,
        require: true,
      },
      emailVisible: {
        type: Boolean,
        default: true,
      },
      verified: {
        type: Boolean,
        default: false,
      },
    },

    /* FIN ----REQUERIDOS AL INICIAR SESION */

    accountType: {
      type: Schema.Types.ObjectId,
      ref: "AccountType",
    },
    name: {
      type: String,
      default: "",
    },

    photoUrl: {
      type: Schema.Types.ObjectId,
      ref: "Avatar",
      default: mongoose.Types.ObjectId,
    },

    videoUrl: {
      type: Schema.Types.ObjectId,
      ref: "PresentationVideo",
      default: mongoose.Types.ObjectId,
    },
    profileUrl: {
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

    country: {
      name: {
        type: String,
        default: "",
      },
      iso2: {
        type: String,
        default: "",
      },
    },

    provinceDepartmentState: {
      name: {
        type: String,
        default: "",
      },
      iso2: {
        type: String,
        default: "",
      },
    },

    city: {
      name: {
        type: String,
        default: "",
      },
      iso2: {
        type: String,
        default: "",
      },
    },

    status: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },

    preferences: {
      type: [{ type: Schema.Types.ObjectId, ref: "Preference" }],
      default: [], //array de referencias de id {id, value}
    },
    networks: {
      type: [{ type: Schema.Types.ObjectId, ref: "UserNetwork" }],
      default: [], // por definir
    },
    networkMore: {
      type: [{ type: String }],
      default: [],
    },

    personAccount: {
      type: Schema.Types.ObjectId,
      ref: "PersonAccount",
    },
    companyAccount: {
      type: Schema.Types.ObjectId,
      ref: "CompanyAccount",
    },
    isCompany: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
userSchema.index({ name: "text", username: "text" });
userSchema.index({ "email.value": 1 }, { unique: true, sparse: true });
export const userModel = model("User", userSchema);

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

/* 

New User
User {
  _id: string;
  username: string;
  email:string;
  password: string;
  photoUrl: Schema.Types.ObjectId | Avatar;
  profileUrl: string;
  accountType: string;
  videoUrl: Schema.Types.ObjectId;
  proTitle: string;
  proTitleVisible: boolean;
  phoneArea: string;
  phone: string;
  phoneVisible: boolean;
  country: string;
  provinceDepartmentState: string;
  cityId: string;
  status: string;
  about: string;
  numberFollowers: number;
  numberFollowing: number;
  views: number;
  preferences: Schema.Types.ObjectId[];
  networks: Schema.Types.ObjectId[];
  networkMore: Schema.Types.ObjectId[];
  personalAccount:'';// si es cuenta personal se inyecta la data de la cuenta persona, si no es null
  companyAcount:''; // si es cuenta de compañia se inyecta la data de la cuenta compañia, si no es null
  isCompany:boolean;
} */
