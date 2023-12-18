import numpy as np
import skfuzzy as fuzz
import matplotlib.pyplot as plt

# Define input variables and ranges
time_of_day = np.arange(0, 24, 0.1)
season = np.arange(0, 12, 0.1)

# Generate Gaussian membership functions for different time-of-day categories
morning_mf = fuzz.gaussmf(time_of_day, 8, 2)
noon_mf = fuzz.gaussmf(time_of_day, 12, 2)
afternoon_mf = fuzz.gaussmf(time_of_day, 15, 2)
evening_mf = fuzz.gaussmf(time_of_day, 19, 2)
night_mf = fuzz.gaussmf(time_of_day, 21, 2)

# Generate Gaussian membership functions for different seasons
spring_mf = fuzz.gaussmf(season, 3, 1.5)
summer_mf = fuzz.gaussmf(season, 6, 1.5)
autumn_mf = fuzz.gaussmf(season, 9, 1.5)
winter_mf = fuzz.gaussmf(season, 0, 1.5)

# Fuzzy system (example usage)
# Initialize output variables
output_window_closed_all_hours_spring = np.zeros_like(time_of_day)
output_window_closed_all_hours_summer = np.zeros_like(time_of_day)
output_window_closed_all_hours_autumn = np.zeros_like(time_of_day)
output_window_closed_all_hours_winter = np.zeros_like(time_of_day)

# Test all hours of the day for each season
for i, hour in enumerate(time_of_day):
    for input_season, output_window_closed_all_hours in zip([3, 6, 9, 0],
                                                           [output_window_closed_all_hours_spring,
                                                            output_window_closed_all_hours_summer,
                                                            output_window_closed_all_hours_autumn,
                                                            output_window_closed_all_hours_winter]):
        # Membership degree for each category
        membership_time = {
            'Morning': fuzz.interp_membership(time_of_day, morning_mf, hour),
            'Noon': fuzz.interp_membership(time_of_day, noon_mf, hour),
            'Afternoon': fuzz.interp_membership(time_of_day, afternoon_mf, hour),
            'Evening': fuzz.interp_membership(time_of_day, evening_mf, hour),
            'Night': fuzz.interp_membership(time_of_day, night_mf, hour)
        }

        membership_season = {
            'Spring': fuzz.interp_membership(season, spring_mf, input_season),
            'Summer': fuzz.interp_membership(season, summer_mf, input_season),
            'Autumn': fuzz.interp_membership(season, autumn_mf, input_season),
            'Winter': fuzz.interp_membership(season, winter_mf, input_season)
        }

        # Fuzzy rules
        rule1_strength = min(membership_time['Morning'], membership_season['Spring'])
        rule2_strength = membership_time['Night']
        rule3_strength = max(membership_time['Afternoon'], membership_time['Evening']) * membership_season[
            'Spring']
        rule4_strength = membership_time['Noon'] * membership_season['Summer']
        rule5_strength = membership_time['Morning'] * membership_season['Winter']
        rule6_strength = max(membership_time['Afternoon'], membership_time['Evening']) * membership_season[
            'Autumn']
        rule7_strength = membership_time['Noon'] * membership_season['Spring']
        rule8_strength = (membership_time['Morning'] + membership_time['Night']) * membership_season['Summer']
        rule9_strength = membership_time['Noon'] * membership_season['Autumn']
        rule10_strength = membership_time['Evening'] * membership_season['Winter']
 # Rule 11: If it's Noon in Spring, then the window is likely open
        rule11_strength = membership_time['Noon'] * membership_season['Spring']

        # Rule 12: If it's Night in Summer, then the window is likely closed
        rule12_strength = membership_time['Night'] * membership_season['Summer']

        # Rule 13: If it's Morning or Evening in Summer, then the window is likely open
        rule13_strength = (membership_time['Morning'] + membership_time['Evening']) * membership_season['Summer']

        # Rule 14: If it's Noon in Winter, then the window is likely closed
        rule14_strength = membership_time['Noon'] * membership_season['Winter']

        # Rule 15: If it's Morning or Night in Autumn, then the window is likely closed
        rule15_strength = (membership_time['Morning'] + membership_time['Night']) * membership_season['Autumn']

        # Rule 16: If it's Evening in Spring, then the window is likely open
        rule16_strength = membership_time['Evening'] * membership_season['Spring']

        # Rule 17: If it's Afternoon or Night in Summer, then the window is likely closed
        rule17_strength = max(membership_time['Afternoon'], membership_time['Night']) * membership_season['Summer']

        # Rule 18: If it's Morning in Summer, then the window is likely open
        rule18_strength = membership_time['Morning'] * membership_season['Summer']

        # Rule 19: If it's Noon or Afternoon in Autumn, then the window is likely open
        rule19_strength = (membership_time['Noon'] + membership_time['Afternoon']) * membership_season['Autumn']

        # Rule 20: If it's Night in Winter, then the window is likely closed
        rule20_strength = membership_time['Night'] * membership_season['Winter']

        # Combine rules for the final output (window_open)
        output_window_open = np.fmax.reduce([
            rule1_strength,
            rule3_strength,
            rule4_strength,
            rule6_strength,
            rule7_strength,
            rule8_strength,
            rule9_strength,
            rule10_strength,
            rule11_strength,
            rule12_strength,
            rule13_strength,
            rule14_strength,
            rule15_strength,
            rule16_strength,
            rule17_strength,
            rule18_strength,
            rule19_strength
        ])

        # Complement for window_closed
        output_window_closed_all_hours[i] = 1 - output_window_open

# Visualization of the results for window_closed for each season
plt.figure(figsize=(15, 10))

plt.subplot(2, 2, 1)
plt.plot(time_of_day, output_window_closed_all_hours_spring, label='Spring - Window Closed')
plt.title('Fuzzy System Output for Spring')
plt.xlabel('Time of Day (hours)')
plt.ylabel('Membership Degree')
plt.legend()
plt.grid(True)

plt.subplot(2, 2, 2)
plt.plot(time_of_day, output_window_closed_all_hours_summer, label='Summer - Window Closed')
plt.title('Fuzzy System Output for Summer')
plt.xlabel('Time of Day (hours)')
plt.ylabel('Membership Degree')
plt.legend()
plt.grid(True)

plt.subplot(2, 2, 3)
plt.plot(time_of_day, output_window_closed_all_hours_autumn, label='Autumn - Window Closed')
plt.title('Fuzzy System Output for Autumn')
plt.xlabel('Time of Day (hours)')
plt.ylabel('Membership Degree')
plt.legend()
plt.grid(True)

plt.subplot(2, 2, 4)
plt.plot(time_of_day, output_window_closed_all_hours_winter, label='Winter - Window Closed')
plt.title('Fuzzy System Output for Winter')
plt.xlabel('Time of Day (hours)')
plt.ylabel('Membership Degree')
plt.legend()
plt.grid(True)

plt.tight_layout()
plt.show()
