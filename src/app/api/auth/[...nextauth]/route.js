// app/api/auth/[...nextauth]/route.js
import { handlers } from "../../../../auth"; // path adjust করো (src/auth.js হলে "../../../auth")

export const { GET, POST } = handlers;
