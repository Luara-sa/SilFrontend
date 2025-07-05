import { useState } from "react";
import { meStore } from "store/meStore";
import { _AuthService } from "services/auth.service";

export const useStudentProfile = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const updateProfile = async () => {
    if (isUpdating) {
      console.warn("Profile update already in progress");
      return null;
    }

    setIsUpdating(true);

    try {
      const updatedUser = await _AuthService.fetchAndUpdateStudentProfile(
        meStore
      );

      if (updatedUser) {
        setLastUpdated(new Date());

        return updatedUser;
      } else {
        console.warn("Profile update completed but no data returned");
        return null;
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateProfile,
    isUpdating,
    lastUpdated,
  };
};
