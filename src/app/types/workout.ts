
export interface IWorkout {
    id: string | number;
    name: string;
    description?: string;
    image: string;
    equipment?: string;
    difficulty?: string;
    sets?: string | number;
    reps?: string | number;
    duration?: number | string;
    calories?: number;
    caloriesBurned?: number; // Eita add kore deben
    rating?: number;
    muscleGroups?: string[]; // Eita add kore deben
    instructions?: string[];
}