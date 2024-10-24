export interface User {
    id?: number;  // '?' indique que l'id est optionnel, car lors de l'inscription l'utilisateur n'a pas encore d'ID.
    name: string;
    email: string;
    password: string;
    roles?: string[];  // Le rôle est optionnel
}
