/**
 * @author Bikas Vaibhav (http://bikasv.com) 2013
 * Rewrote the plug-in at https://github.com/phonegap/phonegap-plugins/tree/master/Android/DatePicker
 * It can now accept `min` and `max` dates for DatePicker.
 *
 * @author Andre Moraes (https://github.com/andrelsmoraes)
 * Refactored code, changed default mode to show date and time dialog.
 * Added options `okText`, `cancelText`, `todayText`, `nowText`, `is24Hour`.
 */

package com.plugin.datepicker;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.TimeZone;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.annotation.SuppressLint;
import android.app.DatePickerDialog;
import android.app.DatePickerDialog.OnDateSetListener;
import android.app.TimePickerDialog;
import android.app.TimePickerDialog.OnTimeSetListener;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Build;
import android.util.Log;
import android.widget.DatePicker;
import android.widget.DatePicker.OnDateChangedListener;
import android.widget.TimePicker;

@SuppressLint("NewApi")
public class DatePickerPlugin extends CordovaPlugin {

	private static final String ACTION_DATE = "date";
	private static final String ACTION_TIME = "time";
	private static final String RESULT_ERROR = "error";
	private final String pluginName = "DatePickerPlugin";
	
	// On some devices, onDateSet or onTimeSet are being called twice
	private boolean called = false;
	private boolean canceled = false;

	@Override
	public boolean execute(final String action, final JSONArray data, final CallbackContext callbackContext) {
		Log.d(pluginName, "DatePicker called with options: " + data);
		called = false;
		canceled = false;
		boolean result = false;

		this.show(data, callbackContext);
		result = true;

		return result;
	}

	public synchronized void show(final JSONArray data, final CallbackContext callbackContext) {
		DatePickerPlugin datePickerPlugin = this;
		Context currentCtx = cordova.getActivity();
		Runnable runnable;
		JsonDate jsonDate = new JsonDate().fromJson(data);
		
		if (ACTION_TIME.equalsIgnoreCase(jsonDate.action)) {
			runnable = runnableTimeDialog(datePickerPlugin, currentCtx,
					callbackContext, jsonDate, Calendar.getInstance(TimeZone.getDefault()));

		} else {
			runnable = runnableDatePicker(datePickerPlugin, currentCtx, callbackContext, jsonDate);
		}

		cordova.getActivity().runOnUiThread(runnable);
	}
	
	private Runnable runnableTimeDialog(final DatePickerPlugin datePickerPlugin,
			final Context currentCtx, final CallbackContext callbackContext,
			final JsonDate jsonDate, final Calendar calendarDate) {
		return new Runnable() {
			@Override
			public void run() {
				final TimeSetListener timeSetListener = new TimeSetListener(datePickerPlugin, callbackContext, calendarDate);
				final TimePickerDialog timeDialog = new TimePickerDialog(currentCtx, timeSetListener, jsonDate.hour,
						jsonDate.minutes, jsonDate.is24Hour);
				if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
					timeDialog.setCancelable(true);
					timeDialog.setCanceledOnTouchOutside(false);
					if (!jsonDate.nowText.isEmpty()){
						timeDialog.setButton(DialogInterface.BUTTON_NEUTRAL, jsonDate.nowText, new DialogInterface.OnClickListener() {
							@Override
							public void onClick(DialogInterface dialog, int which) {
								Calendar now = Calendar.getInstance();
			                	timeDialog.updateTime(now.get(Calendar.HOUR_OF_DAY), now.get(Calendar.MINUTE));
							}
						});
			        }
					String labelCancel = jsonDate.cancelText.isEmpty() ? currentCtx.getString(android.R.string.cancel) : jsonDate.cancelText; 
					timeDialog.setButton(DialogInterface.BUTTON_NEGATIVE, labelCancel, new DialogInterface.OnClickListener() {
						@Override
						public void onClick(DialogInterface dialog, int which) {
							canceled = true;
						}
					});
					String labelOk = jsonDate.okText.isEmpty() ? currentCtx.getString(android.R.string.ok) : jsonDate.okText;
					timeDialog.setButton(DialogInterface.BUTTON_POSITIVE, labelOk, new DialogInterface.OnClickListener() {
						@Override
						public void onClick(DialogInterface dialog, int which) {
						}
					});
				}
				timeDialog.show();
			}
		};
	}
	
	private Runnable runnableDatePicker(
			final DatePickerPlugin datePickerPlugin, final Context currentCtx,
			final CallbackContext callbackContext, final JsonDate jsonDate) {
		return new Runnable() {
			@Override
			public void run() {
				final DateSetListener dateSetListener = new DateSetListener(datePickerPlugin, callbackContext, jsonDate);
				final DatePickerDialog dateDialog = new DatePickerDialog(currentCtx, dateSetListener, jsonDate.year,
						jsonDate.month, jsonDate.day);
				if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB) {
					prepareDialog(dateDialog, callbackContext, currentCtx, jsonDate);
				}
				else {
					prepareDialogPreHoneycomb(dateDialog, callbackContext, currentCtx, jsonDate);
				}
				dateDialog.show();
			}
		};
	}
	
	private void prepareDialog(final DatePickerDialog dateDialog,
			final CallbackContext callbackContext, Context currentCtx, JsonDate jsonDate) {
		
		DatePicker dp = dateDialog.getDatePicker();
		if(jsonDate.minDate > 0) {
			dp.setMinDate(jsonDate.minDate);
		}
		if(jsonDate.maxDate > 0 && jsonDate.maxDate > jsonDate.minDate) {
			dp.setMaxDate(jsonDate.maxDate);
		}

		dateDialog.setCancelable(true);
		dateDialog.setCanceledOnTouchOutside(false);
		if (!jsonDate.todayText.isEmpty()){
            dateDialog.setButton(DialogInterface.BUTTON_NEUTRAL, jsonDate.todayText, new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                	Calendar now = Calendar.getInstance();
                	dateDialog.updateDate(now.get(Calendar.YEAR), now.get(Calendar.MONTH), now.get(Calendar.DAY_OF_MONTH));
                }
            });
        }
		String labelCancel = jsonDate.cancelText.isEmpty() ? currentCtx.getString(android.R.string.cancel) : jsonDate.cancelText; 
		dateDialog.setButton(DialogInterface.BUTTON_NEGATIVE, labelCancel, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
				canceled = true;
            }
        });
		String labelOk = jsonDate.okText.isEmpty() ? currentCtx.getString(android.R.string.ok) : jsonDate.okText;
		dateDialog.setButton(DialogInterface.BUTTON_POSITIVE, labelOk, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
            }
        });
	}
	
	private void prepareDialogPreHoneycomb(DatePickerDialog dateDialog,
			final CallbackContext callbackContext, Context currentCtx, final JsonDate jsonDate){
		java.lang.reflect.Field mDatePickerField = null;
		try {
			mDatePickerField = dateDialog.getClass().getDeclaredField("mDatePicker");
		} catch (NoSuchFieldException e) {
			callbackContext.error(RESULT_ERROR);
		}
		mDatePickerField.setAccessible(true);
		DatePicker pickerView = null;
		try {
			pickerView = (DatePicker) mDatePickerField.get(dateDialog);
		} catch (IllegalArgumentException e) {
			callbackContext.error(RESULT_ERROR);
		} catch (IllegalAccessException e) {
			callbackContext.error(RESULT_ERROR);
		}

		final Calendar startDate = Calendar.getInstance();
		startDate.setTimeInMillis(jsonDate.minDate);
		final Calendar endDate = Calendar.getInstance();
		endDate.setTimeInMillis(jsonDate.maxDate);

		final int minYear = startDate.get(Calendar.YEAR);
	    final int minMonth = startDate.get(Calendar.MONTH);
	    final int minDay = startDate.get(Calendar.DAY_OF_MONTH);
	    final int maxYear = endDate.get(Calendar.YEAR);
	    final int maxMonth = endDate.get(Calendar.MONTH);
	    final int maxDay = endDate.get(Calendar.DAY_OF_MONTH);

		if(startDate !=null || endDate != null) {
			pickerView.init(jsonDate.year, jsonDate.month, jsonDate.day, new OnDateChangedListener() {
                @Override
				public void onDateChanged(DatePicker view, int year, int month, int day) {
                	if(jsonDate.maxDate > 0 && jsonDate.maxDate > jsonDate.minDate) {
	                	if(year > maxYear || month > maxMonth && year == maxYear || day > maxDay && year == maxYear && month == maxMonth){
	                		view.updateDate(maxYear, maxMonth, maxDay);
	                	}
                	}
                	if(jsonDate.minDate > 0) {
	                	if(year < minYear || month < minMonth && year == minYear || day < minDay && year == minYear && month == minMonth) {
	                		view.updateDate(minYear, minMonth, minDay);
	                	}
                	}
            	}
            });
		}
	}

	private final class DateSetListener implements OnDateSetListener {
		private JsonDate jsonDate;
		private final DatePickerPlugin datePickerPlugin;
		private final CallbackContext callbackContext;

		private DateSetListener(DatePickerPlugin datePickerPlugin, CallbackContext callbackContext, JsonDate jsonDate) {
			this.datePickerPlugin = datePickerPlugin;
			this.callbackContext = callbackContext;
			this.jsonDate = jsonDate;
		}

		/**
		 * Return a string containing the date in the format YYYY/MM/DD or call TimeDialog if action != date
		 */
		@Override
		public void onDateSet(final DatePicker view, final int year, final int monthOfYear, final int dayOfMonth) {
			if (canceled || called) {
				return;
			}
			called = true;
			canceled = false;
			
			if (ACTION_DATE.equalsIgnoreCase(jsonDate.action)) {
				String returnDate = year + "/" + (monthOfYear + 1) + "/" + dayOfMonth;
				callbackContext.success(returnDate);
			
			} else {
				// Open time dialog
				Calendar selectedDate = Calendar.getInstance();
				selectedDate.set(Calendar.YEAR, year);
				selectedDate.set(Calendar.MONTH, monthOfYear);
				selectedDate.set(Calendar.DAY_OF_MONTH, dayOfMonth);
				
				cordova.getActivity().runOnUiThread(runnableTimeDialog(datePickerPlugin, cordova.getActivity(),
						callbackContext, jsonDate, selectedDate));
			}
		}
	}

	private final class TimeSetListener implements OnTimeSetListener {
		private Calendar calendarDate;
		private final CallbackContext callbackContext;

		private TimeSetListener(DatePickerPlugin datePickerPlugin, CallbackContext callbackContext, Calendar selectedDate) {
			this.callbackContext = callbackContext;
			this.calendarDate = selectedDate != null ? selectedDate : Calendar.getInstance();
		}

		/**
		 * Return the current date with the time modified as it was set in the
		 * time picker.
		 */
		@Override
		public void onTimeSet(final TimePicker view, final int hourOfDay, final int minute) {
			if (canceled) {
				return;
			}
			
			calendarDate.set(Calendar.HOUR_OF_DAY, hourOfDay);
			calendarDate.set(Calendar.MINUTE, minute);
			calendarDate.set(Calendar.SECOND, 0);

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
			sdf.setTimeZone(TimeZone.getTimeZone("GMT"));
			String toReturn = sdf.format(calendarDate.getTime());

			callbackContext.success(toReturn);
		}
	}
	
	private final class JsonDate {
		
		private String action = "date";
		private String okText, cancelText, todayText = "", nowText = "";
		private long minDate = 0, maxDate = 0;
		private int month, day, year, hour, minutes;
		private boolean is24Hour = false;
		
		public JsonDate() {
			reset(Calendar.getInstance());
		}
		
		private void reset(Calendar c) {
			year = c.get(Calendar.YEAR);
			month = c.get(Calendar.MONTH);
			day = c.get(Calendar.DAY_OF_MONTH);
			hour = c.get(Calendar.HOUR_OF_DAY);
			minutes = c.get(Calendar.MINUTE);
		}
		
		public JsonDate fromJson(JSONArray data) {
			try {
				JSONObject obj = data.getJSONObject(0);
				action = obj.getString("mode");
				
				String optionDate = obj.getString("date");

				String[] datePart = optionDate.split("/");
				month = Integer.parseInt(datePart[0]) - 1;
				day = Integer.parseInt(datePart[1]);
				year = Integer.parseInt(datePart[2]);
				hour = Integer.parseInt(datePart[3]);
				minutes = Integer.parseInt(datePart[4]);

				minDate = obj.has("minDate") ? obj.getLong("minDate") : 0l;
				maxDate = obj.has("maxDate") ? obj.getLong("maxDate") : 0l;
				
				okText = obj.has("okText") ? obj.getString("okText") : "";
				cancelText = obj.has("cancelText") ? obj.getString("cancelText") : "";
				todayText = obj.has("todayText") ? obj.getString("todayText") : "";
				nowText = obj.has("nowText") ? obj.getString("nowText") : "";
				is24Hour = obj.has("is24Hour") ? obj.getBoolean("is24Hour")
						: false;
				
			} catch (JSONException e) {
				reset(Calendar.getInstance());
			}
						
			return this;
		}
	}

}