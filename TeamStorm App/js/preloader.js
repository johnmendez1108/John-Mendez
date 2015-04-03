function preload()
{
	var loader = $("#element").introLoader({
					animation: {
                        name: 'simpleLoader',
                        options: {
                            effect:'slideUp',
                            ease: "easeInOutCirc",
                            style: 'light',
                            delayTime: 1000, //delay time in milliseconds
                            //animationTime: 500,
                            exitTime: 500,
                            onAfter: function() {alert('onAfter');}
                            
                        }
                    },    

                    spinJs: {
                        lines: 10, // The number of lines to draw
                        length: 15, // The length of each line
                        width: 10, // The line thickness
                        radius: 20, // The radius of the inner circle
                        corners: 1, // Corner roundness (0..1)
                        color: '#ffffff', // #rgb or #rrggbb or array of colors
                    }
				});
	
}